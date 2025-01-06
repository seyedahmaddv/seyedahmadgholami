import { SiTypescript, SiReact, SiNextdotjs, SiFirebase, SiJavascript, SiCsswizardry, SiGithub   } from "react-icons/si";
import './ProfesionalSkiils.css'


export default function ProfesionalSkills() {
    const icons = [
        { icon: <SiReact />, name: "React", link: "https://reactjs.org/" },
        { icon: <SiTypescript />, name: "TypeScript", link: "https://www.typescriptlang.org/" },
        { icon: <SiNextdotjs />, name: "Next.js", link: "https://nextjs.org/" },
        { icon: <SiFirebase />, name: "Firebase", link: "https://firebase.google.com/" },
        { icon: <SiJavascript />, name: "Javascript", link: "https://reactjs.org/" },
        { icon: <SiCsswizardry />, name: "CSS", link: "https://www.typescriptlang.org/" },
        { icon: <SiGithub />, name: "Github", link: "https://github.com/seyedahmaddv" },
    ];
    // دوبار تکرار کردن آرایه برای انیمیشن بی‌پایان
    const repeatedIcons = [...icons];
    return (
        <div className="mt-16">
            <h3 className="text-sm text-center opacity-40">Profesional Skills I have</h3>
            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)] ">
            <div className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll md:animate-none">
                {repeatedIcons.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 text-4xl text-gray-300 transition hover:scale-105 hover:text-white"
                        title={item.name}
                    >
                        {item.icon}
                    </a>
                ))}
            </div>
            </div>
        </div>
    )
}
