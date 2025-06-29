import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Shield, Users, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About CogniWeave</h1>
          <p className="text-xl text-muted-foreground">
            Revolutionizing digital accessibility through AI-powered cognitive adaptation
          </p>
        </div>

        {/* Problem Statement */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">The Challenge We're Solving</CardTitle>
              <CardDescription>
                Understanding the barriers faced by neurodivergent learners in digital environments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">15-20%</div>
                  <p className="text-sm text-muted-foreground">of students are neurodivergent</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">50%</div>
                  <p className="text-sm text-muted-foreground">don't disclose their needs due to stigma</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">1-Size</div>
                  <p className="text-sm text-muted-foreground">fits all approach fails many learners</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Current assistive technologies are reactive, siloed, and slow. Students with ADHD, dyslexia, and other
                learning differences face overwhelming walls of text, visual distractions, and complex vocabulary that
                make digital learning a barrier rather than a bridge to knowledge.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">How CogniWeave Works</h2>
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">Cognitive Profile Creation</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Our AI-powered onboarding wizard analyzes your learning preferences through a simple questionnaire.
                  Using advanced language models, we create a detailed cognitive profile that understands your unique
                  needs.
                </p>
                <Badge variant="secondary">Powered by AI</Badge>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Smart Profiling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Reading style analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Distraction sensitivity mapping
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Learning preference detection
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <Card className="md:order-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Real-Time Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Sub-50ms transformation latency
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Edge-native processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Seamless content adaptation
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <div className="md:order-1">
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">Real-Time Transformation</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  As you browse the web, CogniWeave instantly transforms content to match your cognitive profile. Text
                  is chunked, vocabulary is simplified, and distractions are filtered - all in real-time with
                  imperceptible latency.
                </p>
                <Badge variant="secondary">Edge Computing</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">Privacy-First Architecture</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Your browsing data never leaves your device. Our edge-native architecture processes content locally,
                  ensuring complete privacy while delivering the personalized experience you need.
                </p>
                <Badge variant="secondary">Privacy by Design</Badge>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Secure & Private
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Local data processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      No browsing data stored
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      FERPA compliant design
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Demo Steps */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Try the Demo</CardTitle>
              <CardDescription>Experience CogniWeave's transformation capabilities in action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Your Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete our 6-step onboarding wizard to generate your personalized cognitive profile.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Visit the Demo Page</h4>
                    <p className="text-sm text-muted-foreground">
                      See a complex quantum mechanics article before and after CogniWeave transformation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Experience the Magic</h4>
                    <p className="text-sm text-muted-foreground">
                      Watch as dense paragraphs become digestible chunks, complex terms get simplified, and distractions
                      fade away.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Fine-tune Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the dashboard to adjust your preferences and see how it affects the transformation.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Link href="/onboarding">
                  <Button>
                    Start Demo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline">View Demo Page</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Technology */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Built with Cutting-Edge Technology</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI & Machine Learning</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Amazon Bedrock (Claude 3)</p>
                <p>• Amazon SageMaker</p>
                <p>• Edge-optimized models</p>
                <p>• Real-time inference</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frontend Stack</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Next.js 15 (App Router)</p>
                <p>• React 19</p>
                <p>• Tailwind CSS v4</p>
                <p>• shadcn/ui components</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cloud Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• AWS Wavelength (5G Edge)</p>
                <p>• AWS Snowcone</p>
                <p>• Amazon DynamoDB</p>
                <p>• Amazon S3</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Sub-50ms latency</p>
                <p>• Edge computing</p>
                <p>• Privacy-first design</p>
                <p>• Real-time processing</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Impact */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Our Impact Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                CogniWeave represents a fundamental paradigm shift from reactive assistive tools to proactive cognitive
                adaptation. By making the web natively accessible for neurodivergent learners, we're not just breaking
                down barriers - we're building bridges to a more equitable digital future.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Empowerment</h4>
                  <p className="text-sm text-muted-foreground">
                    Learners gain independence without needing to disclose their conditions
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Equity</h4>
                  <p className="text-sm text-muted-foreground">
                    Equal access to information regardless of cognitive differences
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold mb-2">Innovation</h4>
                  <p className="text-sm text-muted-foreground">Setting new standards for inclusive digital design</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience the Future of Accessible Web?</h2>
          <p className="text-muted-foreground mb-6">
            Join the movement towards a more inclusive digital world. Start your journey with CogniWeave today.
          </p>
          <Link href="/onboarding">
            <Button size="lg">
              Get Started Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
