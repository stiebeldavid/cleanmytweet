import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Marketing mishaps are costly, driven by natural limits of human content moderation.",
    author: "Marketing Expert"
  },
  {
    quote: "Central marketing sets so many rules; it's hard to follow. Clairity saves time and reduces manual review time",
    author: "Brand Manager"
  }
];

export const Testimonials = () => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Experts Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg">
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              <p className="text-lg text-gray-600 italic mb-4">{testimonial.quote}</p>
              <p className="text-sm text-gray-500 font-semibold">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};