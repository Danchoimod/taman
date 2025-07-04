import React from 'react';
import ZaloConsentWidget from '../components/ZaloConsentWidget';
import Header from '../components/Header';
import Footer from '../components/Footer';
export default function LienHe() {
  return (
    <div>
        <Header></Header>
      <h1 className="text-2xl font-bold mb- mt-20">Liên hệ</h1>
      <p>Liên hệ với chúng tôi qua Zalo bên dưới:</p>
      <ZaloConsentWidget />
      <Footer></Footer>
    </div>
  );
}
