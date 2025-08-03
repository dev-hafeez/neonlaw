import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { masonryPosts } from "@/lib/masonry-data"

interface PostPageProps {
  params: {
    id: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  const post = masonryPosts.find((p) => p.id === Number.parseInt(params.id))

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-6 pt-24 pb-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-[#0a72bd]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-6 left-6">
              <Badge
                className={`text-sm font-bold px-3 py-1 ${
                  post.category === "DEAL"
                    ? "bg-[#0a72bd] text-white"
                    : post.category === "Expertise"
                      ? "bg-red-600 text-white"
                      : post.category === "Associate" || post.category === "Partner"
                        ? "bg-gray-800 text-white"
                        : post.category === "Career Development"
                          ? "bg-green-600 text-white"
                          : post.category === "NEON NEWS"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-600 text-white"
                }`}
              >
                {post.category}
              </Badge>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              {post.subtitle && <p className="text-lg font-medium mb-2 opacity-90">{post.subtitle}</p>}
              <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>January 15, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>NEON Law Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{post.category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {post.category === "DEAL" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Transaction Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  We are pleased to announce our successful representation in this significant transaction. Our team
                  provided comprehensive legal counsel throughout the entire process, ensuring all regulatory
                  requirements were met and our client's interests were protected.
                </p>

                <h3 className="text-xl font-semibold text-gray-900">Key Details</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Comprehensive due diligence process</li>
                  <li>• Regulatory compliance and approval</li>
                  <li>• Contract negotiation and structuring</li>
                  <li>• Cross-border legal coordination</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Our Role</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our experienced team of corporate lawyers worked closely with all parties to ensure a smooth
                  transaction process. We provided strategic legal advice on structuring, regulatory matters, and risk
                  mitigation throughout the deal lifecycle.
                </p>
              </div>
            )}

            {post.category === "Associate" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Professional Profile</h2>
                <p className="text-gray-700 leading-relaxed">
                  {post.title} is a dedicated associate at NEON Law, specializing in corporate law and commercial
                  transactions. With extensive experience in complex legal matters, they bring valuable expertise to our
                  team.
                </p>

                <h3 className="text-xl font-semibold text-gray-900">Areas of Expertise</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Corporate Law and Governance</li>
                  <li>• Mergers and Acquisitions</li>
                  <li>• Commercial Contracts</li>
                  <li>• Regulatory Compliance</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Education & Background</h3>
                <p className="text-gray-700 leading-relaxed">
                  Graduated with honors from a leading law school and has been practicing law for several years.
                  Committed to providing exceptional legal services and maintaining the highest professional standards.
                </p>
              </div>
            )}

            {post.category === "Expertise" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Practice Area Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our {post.title.toLowerCase()} practice combines deep legal knowledge with practical business
                  understanding to deliver comprehensive solutions for our clients. We handle complex matters with
                  precision and strategic thinking.
                </p>

                <h3 className="text-xl font-semibold text-gray-900">Services We Provide</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Strategic legal counsel and advice</li>
                  <li>• Transaction structuring and execution</li>
                  <li>• Regulatory compliance and risk management</li>
                  <li>• Dispute resolution and litigation support</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Why Choose NEON</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our team brings together years of experience with innovative approaches to legal challenges. We
                  understand the evolving business landscape and provide forward-thinking legal solutions that drive
                  success.
                </p>
              </div>
            )}

            {(post.category === "NEON NEWS" || post.category === "Career Development") && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Latest Updates</h2>
                <p className="text-gray-700 leading-relaxed">
                  Stay connected with the latest developments at NEON Law. We're committed to transparency and keeping
                  our community informed about our growth, achievements, and upcoming opportunities.
                </p>

                <h3 className="text-xl font-semibold text-gray-900">What's New</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our firm continues to expand and evolve, bringing new talent and capabilities to better serve our
                  clients. We're excited to share these developments with our professional network and the broader legal
                  community.
                </p>

                <h3 className="text-xl font-semibold text-gray-900">Get Involved</h3>
                <p className="text-gray-700 leading-relaxed">
                  Interested in joining our team or learning more about our initiatives? We welcome talented individuals
                  who share our commitment to excellence and innovation in legal services.
                </p>
              </div>
            )}

            {post.category === "Legal Insights" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Legal Analysis</h2>
                <p className="text-gray-700 leading-relaxed">
                  {post.description ||
                    "Our legal experts provide in-depth analysis of current regulatory developments and their implications for businesses and individuals."}
                </p>

                <h3 className="text-xl font-semibold text-gray-900">Key Takeaways</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Understanding regulatory changes and compliance requirements</li>
                  <li>• Practical implications for business operations</li>
                  <li>• Strategic recommendations for adaptation</li>
                  <li>• Timeline for implementation and next steps</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Expert Commentary</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our team of legal experts has analyzed these developments and their potential impact on various
                  industries. We provide actionable insights to help our clients navigate these changes effectively.
                </p>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-12 p-8 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Need Legal Assistance?</h3>
            <p className="text-gray-700 mb-6">
              Our experienced team is ready to help you navigate complex legal challenges. Contact us today to discuss
              your specific needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#0a72bd] hover:bg-[#0a72bd]/90 text-white">Contact Us</Button>
              <Button variant="outline">Schedule Consultation</Button>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
