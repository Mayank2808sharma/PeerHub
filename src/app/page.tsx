import GlobeComponent from "@/components/GlobeComponent";
import TypingAnimation from "@/components/TypingAnimation";

function Home() {
  return (
    <>
      <main className="bg-thegray home-no-scroll ">
        <div className="min-h-screen flex items-center justify-center relative ">
          <div className="relative">
            <div className="absolute flex justify-center globe-position pt-10 fade-in3">
              <GlobeComponent />
            </div>
            <div className="relative z-10 pt-0 pb-20">
              <div className="HomeContainer ">
                <h1 className="hidden md:block text-center pb-1 lg:pl-6 pointer-events-none select-none customFont text-7xl text-gray-100 leading-[1.1] max-w-[55rem] fade-in1">
                  Rank the top <span className="pr-10">software</span> <span className="pl-5">developers</span> in <TypingAnimation/>
                </h1>
              </div>
            </div>
          </div>

          <a href="https://github.com/mayank2808sharma" target="_blank" rel="noopener noreferrer" className=" font-Hublot leading-12 tracking-wider pb-2 jack-sheehy">
            <span className="text-gray-300 font-bold">Mayank Sharma 🐗</span> <br />
            <span className="text-gray-400"> ©2024 </span>
          </a>
        </div>
      </main>
    </>
  );
}
export default Home;
