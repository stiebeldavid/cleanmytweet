import { AlertOctagon } from "lucide-react";

const disasters = [
  {
    company: "Heinz",
    description: "Spaghetti sauce advertisement accused of perpetuating racial stereotypes"
  },
  {
    company: "Boston Celtics",
    description: "Tone-deaf tweet combining game victory celebration with mass shooting condolences"
  },
  {
    company: "Dove Soap",
    description: "Controversial advertisement causing brand damage"
  }
];

export const PRDisasters = () => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Examples of Recent PR Disasters
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {disasters.map((disaster, index) => (
            <div key={index} className="bg-red-50 p-6 rounded-lg">
              <AlertOctagon className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-red-900">{disaster.company}</h3>
              <p className="text-red-700">{disaster.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};