import HomeComponents from "./Components/HomeComponents/page";
import ProfesionalSkills from "./Components/HomeComponents/ProfesionalSkills";
import MyServices from "./Components/HomeComponents/Services";

export default function App() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Header */}
      <header className="text-center">
        
      </header>

      
      
      <HomeComponents />
      <ProfesionalSkills />
      <MyServices />
    </main>
  );
}
