import { DollarSign, Clock, CheckCircle } from "lucide-react";

export const ValueProps = () => {
  const values = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Avoid Costly PR Disasters",
      description: "Minimize risks with AI-driven controversy detection"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Efficient Content Approval",
      description: "Skip lengthy legal reviews with tailored AI"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Confident Content Creation",
      description: "Align content with audience sensitivities and brand standards"
    }
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Clairity?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center p-6">
              <div className="text-blue-600 mb-4 flex justify-center">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};