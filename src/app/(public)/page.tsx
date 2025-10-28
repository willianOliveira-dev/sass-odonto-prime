import { Header } from "./_components/_Header";
import { Hero } from "./_components/_Hero";
import { Clinic } from "./_components/_Clinic";
import { Professionals } from "./_components/_Professionals";
import { Footer } from "./_components/_Footer";
import { getProfessionals } from "./data-access-layer/getProfessionals";

export const revalidate = 90;

export default async function HomePage() {
    const professionals = await getProfessionals();
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Hero />
            <Clinic />
            <Professionals professionals={professionals || []} />
            <Footer />
        </div>
    );
}
