export const HeroSection = () => {
  return (
    <div className="text-center py-12 px-4 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
      <div className="relative">
        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 animate-fade-in">
          Clean Your Tweets
          <div className="relative">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-teal-200 mt-1">
              Before They Go Viral
            </span>
            <span className="block text-base italic text-center text-cyan-200/70 mt-1">
              (...for the wrong reason)
            </span>
          </div>
        </h1>
        <div className="absolute -top-16 -left-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-16 -right-20 w-40 h-40 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};