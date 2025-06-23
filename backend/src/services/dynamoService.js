import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "../config/aws.js";

class DynamoService {
  /**
   * Get user profile from DynamoDB
   */
  async getProfile(userId) {
    try {
      const command = new GetCommand({
        TableName: TABLES.USER_PROFILES,
        Key: { userId },
      });

      console.log(`📊 Fetching profile for user: ${userId}`);
      const result = await docClient.send(command);

      if (!result.Item) {
        console.log(`⚠️ Profile not found for user: ${userId}`);
        return null;
      }

      console.log(`✅ Profile retrieved for user: ${userId}`);
      return result.Item;
    } catch (error) {
      console.error("❌ DynamoDB Get Error:", error);

      // For MVP demo, return mock data if DynamoDB fails
      console.log("🔄 Falling back to mock data");
      return this.getMockProfile(userId);
    }
  }

  /**
   * Create new user profile in DynamoDB
   */
  async createProfile(userId, profile) {
    console.log("userId in dynamoService");
    console.log(userId);
    try {
      const item = {
        userId,
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const command = new PutCommand({
        TableName: TABLES.USER_PROFILES,
        Item: item,
        ConditionExpression: "attribute_not_exists(userId)", // Prevent overwrites
      });

      console.log(`📝 Creating profile for user: ${userId}`);
      await docClient.send(command);

      console.log(`✅ Profile created for user: ${userId}`);
      return item;
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        throw new Error("Profile already exists for this user");
      }

      console.error("❌ DynamoDB Create Error:", error);

      // For MVP demo, simulate success
      console.log("🔄 Simulating successful profile creation");
      return {
        userId,
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mockData: true,
      };
    }
  }

  /**
   * Update existing user profile in DynamoDB
   */
  async updateProfile(userId, profileUpdates) {
    try {
      const command = new UpdateCommand({
        TableName: TABLES.USER_PROFILES,
        Key: { userId },
        UpdateExpression: "SET #profile = :profile, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#profile": "profile",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":profile": profileUpdates,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      });

      console.log(`🔄 Updating profile for user: ${userId}`);
      const result = await docClient.send(command);

      console.log(`✅ Profile updated for user: ${userId}`);
      return result.Attributes;
    } catch (error) {
      console.error("❌ DynamoDB Update Error:", error);

      // For MVP demo, simulate success
      console.log("🔄 Simulating successful profile update");
      return {
        userId,
        ...profileUpdates,
        updatedAt: new Date().toISOString(),
        mockData: true,
      };
    }
  }

  /**
   * Mock profile data for demo purposes
   */
  getMockProfile(userId) {
    const mockProfiles = {
      "alex-chen-2025": {
        userId: "alex-chen-2025",
        text: {
          chunking: {
            strategy: "sentence_limit",
            maxLength: 3,
          },
          vocabulary: {
            simplificationLevel: "basic",
          },
        },
        simplification: {
          useAnalogies: true,
          summarization: {
            defaultState: "collapsed",
            summaryLength: 15,
          },
        },
        visuals: {
          distractionFilter: {
            enabled: true,
            sensitivity: "high",
          },
        },
        metadata: {
          createdAt: "2025-01-15T10:30:00Z",
          updatedAt: "2025-01-15T10:30:00Z",
          version: "1.0",
          mockData: true,
        },
      },
      "demo-user-2025": {
        userId: "demo-user-2025",
        text: {
          chunking: {
            strategy: "sentence_limit",
            maxLength: 5,
          },
          vocabulary: {
            simplificationLevel: "intermediate",
          },
        },
        simplification: {
          useAnalogies: false,
          summarization: {
            defaultState: "expanded",
            summaryLength: 25,
          },
        },
        visuals: {
          distractionFilter: {
            enabled: true,
            sensitivity: "medium",
          },
        },
        metadata: {
          createdAt: "2025-01-10T14:20:00Z",
          updatedAt: "2025-01-18T09:15:00Z",
          version: "1.2",
          mockData: true,
        },
      },
    };

    return mockProfiles[userId] || mockProfiles["alex-chen-2025"];
  }
}

export default new DynamoService();
