import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// AWS Configuration
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_REGION_2 = process.env.AWS_REGION_2 || "us-west-2";

// Initialize AWS clients
export const bedrockClient = new BedrockRuntimeClient({
  region: AWS_REGION_2,
  // For MVP demo, these would be configured via environment variables
  // credentials: {
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  // }
});

const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Table configuration
export const TABLES = {
  USER_PROFILES:
    process.env.DYNAMODB_PROFILES_TABLE || "cogniweave-user-profiles",
};

export const BEDROCK_MODELS = {
  CLAUDE_3_OPUS: "anthropic.claude-3-opus-20240229-v1:0",
  CLAUDE_3_5_SONNET: "anthropic.claude-3-5-sonnet-20241022-v2:0",
};
