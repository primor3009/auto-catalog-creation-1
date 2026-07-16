import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import Catalog from '@/components/site/Catalog';
import Contacts from '@/components/site/Contacts';
import Footer from '@/components/site/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
