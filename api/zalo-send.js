export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { phone, template_id, params } = req.body;

    // Gọi API Zalo Official (bạn cần thay access_token thật của OA)
    const zaloRes = await fetch('https://business.openapi.zalo.me/message/template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': 'EzOxT0z7cnO_q3vo2K2S43ZKEdS1MkP-TiaQNYO5sKHLxNiZ82Qd84ln1ZXwQTWl3g4b3KCoz6uQunjVR3gsGGUl57zgFibj6hDjSs9cmKm1iZT5C6AMJ52XP5WoJBDeGeSVS0rKoHjcc14uA5NAEqolCo0ZE9OTOTnKBJ48zazUzrT41YABLctlLKuhEfDFVjHfIomGp2bzrZzF53phBqN6HZ0A5P9QHz9EKtO-wde6_nKQImRF1IZtEmzaPPzjDQDRTMPvY6KDaqy4N5ALFJI0UIf3KQqA4vvS5tf4et4iXtmROqQZFI-I0YGMVlKMNOfD0p1zeHi3kLO1O7wGOZQHSWPzOhPa3PiHS4LXpqbmXGj34t3AQaAo9c5w9U9r2QWlL494wtKNbYeJO6Q6B3MJ835IKkzJULG1e9LJ3bYQ5G'
      },
      body: JSON.stringify({
        phone,
        template_id,
        template_data: params
      })
    });

    let zaloData = null;
    let rawText = '';
    try {
      rawText = await zaloRes.text();
      zaloData = JSON.parse(rawText);
    } catch (err) {
      console.error('Không parse được JSON từ Zalo:', rawText);
      return res.status(200).json({ success: false, message: 'Zalo API trả về không phải JSON: ' + rawText });
    }

    console.log('Zalo API response:', zaloData);

    if (zaloData && zaloData.error === 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false, message: zaloData?.message || JSON.stringify(zaloData) || 'Gửi thất bại' });
    }
  } catch (err) {
    console.error('Lỗi server:', err);
    res.status(500).json({ success: false, message: err.message || 'Lỗi server' });
  }
} 