import { useEffect } from 'react';

const ZaloConsentWidget = () => {
  useEffect(() => {
    // Tạo một div thuần DOM
    const zaloDiv = document.createElement('div');
    zaloDiv.className = 'zalo-consent-widget';
    zaloDiv.setAttribute('data-callback', '');
    zaloDiv.setAttribute('data-oaid', '1187923599968080778');
    zaloDiv.setAttribute('data-user-external-id', '');
    zaloDiv.setAttribute('data-appid', '4251511707707104348');
    zaloDiv.setAttribute('data-reason-msg', '');
    zaloDiv.setAttribute('data-status', 'show');

    // Gắn vào body hoặc div riêng
    document.body.appendChild(zaloDiv);

    // Thêm script nếu chưa có
    const script = document.createElement('script');
    script.src = 'https://sp.zalo.me/plugins/sdk.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup khi component unmount
    return () => {
      document.body.removeChild(zaloDiv);
      document.body.removeChild(script);
    };
  }, []);

  return null; // Không render gì trong React DOM
};

export default ZaloConsentWidget;
