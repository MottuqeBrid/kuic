import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      {/* Icon representing the gear, magnifying glass, and lightbulb */}
      <div className="relative">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          </div>
        </div>
        {/* Gear teeth */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-base-content leading-tight">
          KUIC
        </h1>
        <p className="text-xs text-primary font-medium leading-tight">
          Innovation Club
        </p>
      </div>
    </Link>
  );
};

export default Logo;
