import { DollarSign } from "lucide-react";

const metrics = [
  {
    value: "$5B",
    label: "Annual damages from PR mishaps"
  },
  {
    value: "$70B",
    label: "Global annual spend on PR"
  }
];

export const KeyMetrics = () => {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          The Numbers Speak for Themselves
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center bg-white p-8 rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-4xl font-bold text-blue-600 mb-2">{metric.value}</p>
              <p className="text-gray-600">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};