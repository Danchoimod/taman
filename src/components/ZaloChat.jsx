// src/components/ZaloChat.jsx
import React, { useEffect, useRef } from 'react';

const ZaloChat = ({ oaid, welcomeMessage, autopopup, width, height }) => {
  const widgetRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    // Kiểm tra xem SDK đã được load chưa
    if (window.ZaloSocialSDK) {
      // Nếu đã load rồi, khởi tạo lại widget
      initializeWidget();
    } else {
      // Nếu chưa load, tạo script mới
      loadZaloSDK();
    }

    function initializeWidget() {
      // Tạo thẻ div cho widget
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'zalo-chat-widget';
      widgetDiv.setAttribute('data-oaid', oaid);
      widgetDiv.setAttribute('data-welcome-message', welcomeMessage);
      widgetDiv.setAttribute('data-autopopup', autopopup);
      widgetDiv.setAttribute('data-width', width);
      widgetDiv.setAttribute('data-height', height);

      // Thêm widgetDiv vào body
      document.body.appendChild(widgetDiv);
      widgetRef.current = widgetDiv;

      // Nếu SDK đã sẵn sàng, khởi tạo widget
      if (window.ZaloSocialSDK) {
        window.ZaloSocialSDK.reload();
      }
    }

    function loadZaloSDK() {
      // Kiểm tra xem script đã tồn tại chưa
      const existingScript = document.querySelector('script[src="https://sp.zalo.me/plugins/sdk.js"]');
      if (existingScript) {
        initializeWidget();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sp.zalo.me/plugins/sdk.js';
      script.async = true;
      
      script.onload = () => {
        initializeWidget();
      };

      script.onerror = () => {
        console.error('Failed to load Zalo SDK');
      };

      document.body.appendChild(script);
      scriptRef.current = script;
    }

    // Cleanup function
    return () => {
      // Xóa widget
      if (widgetRef.current && document.body.contains(widgetRef.current)) {
        try {
          document.body.removeChild(widgetRef.current);
        } catch (e) {
          console.warn('Widget element already removed:', e);
        }
      }

      // Không xóa script để tránh lỗi khi chuyển trang
      // Script sẽ được tái sử dụng
    };
  }, [oaid, welcomeMessage, autopopup, width, height]);

  return null;
};

export default ZaloChat;