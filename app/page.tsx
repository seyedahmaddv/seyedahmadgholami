import HomeComponents from "./Components/HomeComponents/page";
import ProfesionalSkills from "./Components/HomeComponents/ProfesionalSkills";
import MyServices from "./Components/HomeComponents/Services";
import Footer from "./Components/ui/Footer";
import Header from "./Components/ui/Header";

export default function App() {
  return (
    <>
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Header */}
      {/* <Header /> */}

      
      
      <HomeComponents />
      <ProfesionalSkills />
      <MyServices />
    </main>
    <footer className="bg-black">
      <Footer />
    </footer>
    </>
  );
}
