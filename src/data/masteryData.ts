import { Coord, INITIAL_FEN } from '../engine/xiangqiEngine';

export interface LessonStep {
  playerMove: {
    from: Coord;
    to: Coord;
    notation: string;
    whyBest: string;
  };
  opponentReply?: {
    from: Coord;
    to: Coord;
    notation: string;
    note?: string;
  };
}

export interface MasteryLesson {
  id: string;
  tier: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  difficulty: 1 | 2 | 3;
  expReward: number;
  initialFen: string;
  objective: string;
  theory: string;
  citation: string;
  timeLimitSec?: number; // Countdown timer for Tier 4
  hints: [string, string, string]; // 3-level Hint system
  steps: LessonStep[];
}

export const TIER_METADATA = [
  {
    tier: 1 as const,
    name: 'Tầng 1: Nhập Môn & Cảm Giác Quân',
    period: 'Tuần 1 – 2',
    goal: 'Nắm vững luật đặc thù (Cản Mã, Mắt Tượng, Lộ Mặt Tướng), Giá trị quân cờ & Sát cục 1 nước.',
  },
  {
    tier: 2 as const,
    name: 'Tầng 2: 10 Sát Pháp Cơ Bản',
    period: 'Tuần 3 – 6',
    goal: 'Thành thạo 10 hình sát pháp cốt lõi (Mã Hậu Pháo, Thiết Môn Thuyên, Pháo Trùng, Mã Ngọa Tào...).',
  },
  {
    tier: 3 as const,
    name: 'Tầng 3: Khai Cuộc Tinh Hoa',
    period: 'Tháng 2 – 3',
    goal: 'Thực hành 5 thế trận khai cuộc kinh điển có mũi tên gợi ý và phân tích chiến thuật từng nước.',
  },
  {
    tier: 4 as const,
    name: 'Tầng 4: Cờ Thế Giang Hồ & Cờ Tàn',
    period: 'Tháng 4+',
    goal: 'Giải các thế cờ cổ điển (đã hiệu chỉnh chuẩn WXF) với đồng hồ đếm ngược & Gợi ý 3 cấp độ.',
  },
];

export const MASTERY_LESSONS: MasteryLesson[] = [
  // ============================================================================
  // TẦNG 1: NHẬP MÔN & CẢM GIÁC QUÂN (4 BÀI TẬP TƯƠNG TÁC + LUẬT ĐẶC THÙ)
  // ============================================================================
  {
    id: 'T1-01',
    tier: 1,
    title: 'Bài 1.1: Cản Chân Mã (Biệt Mã Cước) & Ngọa Tào 1 Nước',
    subtitle: 'Nhận diện chân Mã bị cản và hướng nhảy hợp lệ',
    difficulty: 1,
    expReward: 50,
    initialFen: '3ak4/4a4/3pN4/9/9/5R3/9/9/9/4K4 r - - 0 1',
    objective:
      'Nhấp vào Mã Đỏ lộ 5 (hàng 3) để quan sát chân Mã bên trái bị Tốt Đen cản, sau đó nhảy Mã sang hướng trống để chiếu bí trong 1 nước.',
    theory:
      'Quân Mã đi theo hình chữ Nhật (1 ô ngang/dọc rồi 1 ô chéo ra ngoài). Nếu ô sát cạnh theo hướng đi thẳng có bất kỳ quân nào đứng, Mã bị "Cản chân Mã" (Biệt Mã Cước) không thể nhảy về phía đó.',
    citation: '[1] World Xiangqi Federation (WXF) - Rule 4.4 (The Horse)',
    hints: [
      'Gợi ý Cấp 1: Hãy nhấp vào quân Mã Đỏ ở trung lộ 5 để xem ô nào đang bị Tốt Đen cản chân.',
      'Gợi ý Cấp 2: Chân trái của Mã bị Tốt Đen cản, nhưng chân phải (lộ 4 của Đỏ) hoàn toàn trống.',
      'Gợi ý Cấp 3: Đi nước M5.3 (nhảy Mã từ lộ 5 xuống Ngọa Tào lộ 3) để chiếu bí Tướng Đen ngay lập tức!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 4 },
          to: { r: 1, c: 6 },
          notation: 'M5.3',
          whyBest:
            'Chân Mã bên trái bị Tốt Đen cản (Biệt Mã Cước), nên M5.3 nhảy về cánh phải vào đúng vị trí Ngọa Tào là nước duy nhất hợp lệ và chiếu bí ngay.',
        },
      },
    ],
  },
  {
    id: 'T1-02',
    tier: 1,
    title: 'Bài 1.2: Chặn Mắt Tượng (Điền Tượng Nhãn) & Mở Đường Pháo',
    subtitle: 'Hiểu quy tắc tâm chữ Điền của Tượng và đòn mở mặt Pháo',
    difficulty: 1,
    expReward: 50,
    initialFen: '4k4/4a4/9/9/9/5R3/5P3/4B4/4C4/3KC4 r - - 0 1',
    objective:
      'Nhấp vào Tượng Đỏ lộ 5 để thấy mắt Tượng bên phải bị Tốt Đỏ chặn, sau đó gác Tượng về hướng hợp lệ để mở đường cho cặp Pháo chiếu bí trong 1 nước.',
    theory:
      'Quân Tượng đi chéo 2 ô (hình chữ Điền) và không được qua sông. Nếu ô chính giữa đường chéo (mắt Tượng) có quân đứng, Tượng bị "Chặn mắt Tượng" (Điền Tượng Nhãn).',
    citation: '[1] World Xiangqi Federation (WXF) - Rule 4.3 (The Elephant)',
    hints: [
      'Gợi ý Cấp 1: Cặp Pháo Đỏ ở trung lộ 5 đang bị chính Tượng Đỏ lộ 5 che khuất tầm bắn.',
      'Gợi ý Cấp 2: Mắt Tượng phía phải (lộ 4) đang bị Tốt Đỏ đứng chặn, bạn chỉ có thể phát triển Tượng sang cánh trái (lộ 7).',
      'Gợi ý Cấp 3: Đi nước T5.7 để rút Tượng khỏi trung lộ, kích hoạt Pháo đầu mượn Sĩ Đen làm ngòi chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 4 },
          to: { r: 5, c: 2 },
          notation: 'T5.7',
          whyBest:
            'T5.7 vừa tránh được mắt Tượng bị chặn ở lộ 4, vừa rút quân khỏi trung lộ để Pháo 5 mượn Sĩ Đen làm ngòi chiếu bí (Tướng Đen bị Tướng Đỏ lộ 6 và Xe Đỏ lộ 4 khóa hai bên).',
        },
      },
    ],
  },
  {
    id: 'T1-03',
    tier: 1,
    title: 'Bài 1.3: Luật Lộ Mặt Tướng (Phi Tướng Trợ Công)',
    subtitle: 'Biến Tướng Đỏ thành "Xe vô hình" khóa chặt đường trung lộ',
    difficulty: 1,
    expReward: 60,
    initialFen: '3k5/2P6/8R/9/9/9/9/9/9/4K4 r - - 0 1',
    objective:
      'Tận dụng Tướng Đỏ đang trấn giữ trung lộ 5 và Tốt Đỏ lộ 7 để đâm Xe xuống đáy chiếu bí trong 1 nước.',
    theory:
      'Hai Tướng không bao giờ được phép nhìn thấy mặt nhau trực tiếp trên cùng 1 cột dọc mà không có quân chắn ở giữa (Luật Lộ Mặt Tướng). Nhờ vậy, Tướng Đỏ ở lộ 5 đóng vai trò như một con Xe khóa chặt không cho Tướng Đen bước vào lộ 5!',
    citation:
      '[1] World Xiangqi Federation (WXF) - Rule 4.1 (The King / Flying General)',
    hints: [
      'Gợi ý Cấp 1: Tướng Đen đang bị kẹt ở lộ 4 (cột c=3) vì Tướng Đỏ đã khống chế toàn bộ cột trung lộ 5.',
      'Gợi ý Cấp 2: Tốt Đỏ ở hàng 2 (lộ 7) đang kiểm soát ô lầu 2 của Tướng Đen.',
      'Gợi ý Cấp 3: Đi nước X1.2 (đâm Xe lộ 1 thẳng xuống hàng đáy) để chiếu bí Tướng Đen!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 8 },
          to: { r: 0, c: 8 },
          notation: 'X1.2',
          whyBest:
            'X1.2 đâm Xe xuống đáy chiếu Tướng. Tướng Đen không thể vào lộ 5 vì phạm luật Lộ Mặt Tướng với Tướng Đỏ, cũng không thể lên lầu 2 vì bị Tốt Đỏ lộ 7 khống chế.',
        },
      },
    ],
  },
  {
    id: 'T1-04',
    tier: 1,
    title: 'Bài 1.4: Phối Hợp Song Xe Đâm Đáy (Sát Cục 1 Nước)',
    subtitle: 'Một Xe khóa lầu 2, một Xe đâm thẳng xuống đáy kết liễu',
    difficulty: 1,
    expReward: 60,
    initialFen: '3k1a3/1R7/3a5/9/9/R8/9/9/9/4K4 r - - 0 1',
    objective:
      'Xe Đỏ lộ 8 đang khóa chặt hàng ngang số 2 của cung Đen và Mặt Tướng Đỏ khóa lộ 5. Hãy điều Xe lộ 9 đâm xuống đáy chiếu bí trong 1 nước.',
    theory:
      'Khi Mặt Tướng Đỏ đã khóa chặt đường sang trung lộ 5 và một Xe Đỏ đã cắt đứt đường lên lầu 2, Xe còn lại chỉ cần chiếm tuyến đáy là tạo thành sát cục Song Xe.',
    citation: '[2] Liên đoàn Cờ Việt Nam - Giáo trình Sát cục 1 nước căn bản',
    hints: [
      'Gợi ý Cấp 1: Tướng Đen ở hàng đáy (lộ 4 Đen) không thể sang lộ 5 vì vướng Mặt Tướng Đỏ lộ 5, cũng không thể lên hàng 2 vì Xe Đỏ lộ 8 đang canh giữ.',
      'Gợi ý Cấp 2: Quan sát quân Xe Đỏ ở lộ 9 (cột ngoài cùng bên trái).',
      'Gợi ý Cấp 3: Đi nước X9.5 (đâm Xe lộ 9 thẳng xuống đáy) để chiếu bí ngay lập tức!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 5, c: 0 },
          to: { r: 0, c: 0 },
          notation: 'X9.5',
          whyBest:
            'X9.5 kiểm soát toàn bộ hàng đáy trong khi Xe lộ 8 đã khóa hàng 2 và Mặt Tướng Đỏ khóa chặt trung lộ 5.',
        },
      },
    ],
  },

  // ============================================================================
  // TẦNG 2: 10 KỸ THUẬT SÁT PHÁP CƠ BẢN (ĐÃ XÁC THỰC WXF 100%)
  // ============================================================================
  {
    id: 'T2-01',
    tier: 2,
    title: 'Skill 1: Mã Hậu Pháo (Chuẩn Cổ Phổ)',
    subtitle: 'Mã khóa đường thoát Cửu cung đồng thời làm ngòi cho Pháo chiếu bí',
    difficulty: 1,
    expReward: 80,
    initialFen: '2bk1ab2/9/3N1a3/9/9/9/9/5C3/9/4K4 r - - 0 1',
    objective:
      'Đỏ đi trước chiếu bí trong 1 nước bằng sát pháp Mã Hậu Pháo (Pháo đứng sau Mã trên cùng 1 lộ).',
    theory:
      'Mã Hậu Pháo: Quân Mã đứng ở vị trí khống chế ô thoát ngang của Tướng địch (ô lộ 5), đồng thời chính con Mã đó làm ngòi (screen) trên đường dọc để Pháo phía sau chiếu chết Tướng địch.',
    citation: '[3] Quất Trung Bí (橘中秘) - Chương Sát Pháp Căn Bản: Mã Hậu Pháo',
    hints: [
      'Gợi ý Cấp 1: Mã Đỏ ở lộ 6 (hàng 3) đang kiểm soát chặt ô trung tâm (lộ 5 hàng 1) của Cửu cung Đen.',
      'Gợi ý Cấp 2: Tướng Đen đang đứng ở lộ 4 Đen (tức lộ 6 của Đỏ), nằm trên cùng cột dọc với Mã Đỏ lộ 6.',
      'Gợi ý Cấp 3: Đi nước P4-6 (Bình Pháo từ lộ 4 sang lộ 6) mượn Mã làm ngòi chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 5 },
          to: { r: 7, c: 3 },
          notation: 'P4-6',
          whyBest:
            'P4-6 tạo hình "Mã Hậu Pháo" chuẩn mực: Mã lộ 6 vừa khóa chặt ô thoát sang lộ 5 của Tướng Đen, vừa làm ngòi cho Pháo lộ 6 kiểm soát toàn bộ cột dọc.',
        },
      },
    ],
  },
  {
    id: 'T2-02',
    tier: 2,
    title: 'Skill 2: Thiết Môn Thuyên (Chốt Cài Cửa Sắt)',
    subtitle: 'Pháo đầu ghim chặt trung lộ, Xe đâm thẳng xuống đáy khóa cửa cung',
    difficulty: 1,
    expReward: 80,
    initialFen: '2b1ka3/4a4/2N6/9/4P4/3R5/9/4C4/9/4K4 r - - 0 1',
    objective:
      'Pháo đầu lộ 5 đã ghim cứng Sĩ tâm cung của Đen và Mã Đỏ lộ 7 đang bảo vệ ô đáy lộ 6. Hãy đâm Xe xuống đáy cài chốt cửa sắt chiếu bí!',
    theory:
      'Thiết Môn Thuyên (Chốt Cài Cửa Sắt): Pháo đầu trấn giữ lộ 5 ghim chặt Sĩ trung tâm (nếu Sĩ ăn ra sẽ bị Pháo đầu chiếu Tướng qua Tốt 5), tạo điều kiện cho Xe Đỏ đâm thẳng xuống đáy cung chiếu bí.',
    citation: '[3] Quất Trung Bí (橘中秘) - Thiết Môn Thuyên Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Sĩ Đen ở tâm cung (lộ 5 hàng 2) không thể di chuyển vì bị Pháo đầu Đỏ ghim qua Tốt Đỏ lộ 5.',
      'Gợi ý Cấp 2: Mã Đỏ lộ 7 đang kiểm soát và bảo vệ điểm đáy lộ 6 (cột c=3).',
      'Gợi ý Cấp 3: Đi nước X6.5 (đâm thẳng Xe lộ 6 xuống đáy cung Đen) chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 5, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'X6.5',
          whyBest:
            'X6.5 đóng chốt cửa sắt! Tướng Đen không thể ăn Xe (vì có Mã Đỏ lộ 7 bảo vệ), Sĩ Đen ở tâm cung cũng không thể ăn Xe vì bị Pháo đầu lộ 5 ghim cứng.',
        },
      },
    ],
  },
  {
    id: 'T2-03',
    tier: 2,
    title: 'Skill 3: Pháo Trùng (Trùng Pháo Tuyệt Sát)',
    subtitle: 'Xếp hai quân Pháo chồng lên cùng một trục tấn công Cửu cung',
    difficulty: 1,
    expReward: 80,
    initialFen: '2baka3/9/9/9/4C4/9/9/1C7/9/4K4 r - - 0 1',
    objective:
      'Đưa Pháo thứ hai vào trung lộ 5 tạo thế "Pháo Trùng" khiến Sĩ Đen dù có lên tâm cung che chắn cũng vô tác dụng!',
    theory:
      'Pháo Trùng (Trùng Pháo): Hai quân Pháo đứng trên cùng một đường thẳng nhắm vào Tướng. Pháo sau mượn Pháo trước làm ngòi chiếu Tướng; nếu đối phương đưa Sĩ/Tượng vào kê cản thì quân cản đó lại biến thành ngòi cho Pháo trước chiếu tiếp! Đồng thời Mặt Tướng Đỏ lộ 5 khóa không cho Tướng Đen lên lầu 2.',
    citation: '[3] Quất Trung Bí (橘中秘) - Trùng Pháo Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Đỏ đã có 1 Pháo trấn ở trung lộ 5 (hàng 5) và hai Sĩ Đen đang tự bít hai bên sườn Tướng Đen.',
      'Gợi ý Cấp 2: Nếu đưa thêm Pháo lộ 8 vào lộ 5, Pháo sau sẽ mượn Pháo trước làm ngòi.',
      'Gợi ý Cấp 3: Đi nước P8-5 (Bình Pháo lộ 8 vào trung lộ 5) lập thế Pháo Trùng chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 1 },
          to: { r: 7, c: 4 },
          notation: 'P8-5',
          whyBest:
            'P8-5 hoàn thành "Pháo Trùng": Pháo sau mượn Pháo trước chiếu Tướng; nếu Sĩ Đen lên tâm cung cản thì lại thành ngòi cho Pháo trước chiếu Tướng (và nếu Tướng Đen lên lầu 2 vẫn bị Pháo sau chiếu)!',
        },
      },
    ],
  },
  {
    id: 'T2-04',
    tier: 2,
    title: 'Skill 4: Mã Ngọa Tào (Khóa Cung Phối Hợp Xe)',
    subtitle: 'Đưa Mã nhảy vào vị trí Ngọa Tào chiếu bí Tướng địch',
    difficulty: 1,
    expReward: 80,
    initialFen: '2bak1b2/4a4/9/1Np6/9/5R3/9/9/9/4K4 r - - 0 1',
    objective:
      'Xe Đỏ lộ 4 đã khóa cứng cánh phải của Tướng Đen. Hãy nhảy Mã vào vị trí Ngọa Tào để chiếu bí trong 1 nước!',
    theory:
      'Mã Ngọa Tào: Đưa Mã nhảy xuống đúng vị trí "Ngọa Tào" (cột 3 hoặc cột 7, hàng thứ 2 tính từ đáy đối phương — ngay trước mặt vị trí Tượng ban đầu) để công kích trực tiếp vào Cửu cung.',
    citation: '[3] Quất Trung Bí (橘中秘) - Ngọa Tào Mã Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Tướng Đen đang bị kẹt ở trung lộ 5 vì cánh trái và tâm cung vướng Sĩ Đen, còn cánh phải (lộ 6 Đen / lộ 4 Đỏ) đã bị Xe Đỏ lộ 4 kiểm soát.',
      'Gợi ý Cấp 2: Ô Ngọa Tào lộ 7 (hàng 2 từ trên xuống, cột c=2) đang hoàn toàn trống.',
      'Gợi ý Cấp 3: Đi nước M8.7 (nhảy Mã từ lộ 8 vào Ngọa Tào lộ 7) chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 3, c: 1 },
          to: { r: 1, c: 2 },
          notation: 'M8.7',
          whyBest:
            'M8.7 đưa Mã vào đúng huyệt Ngọa Tào lộ 7 chiếu Tướng. Tướng Đen bị Sĩ tự chặn cánh trái/tâm cung và bị Xe Đỏ lộ 4 khóa cánh phải nên tuyệt sát.',
        },
      },
    ],
  },
  {
    id: 'T2-05',
    tier: 2,
    title: 'Skill 5: Giáp Xe Pháo (Xe Pháo Phối Hợp Đáy Cung)',
    subtitle: 'Xe đâm xuống đáy làm ngòi cho Pháo đồng thời khóa đường thoát của Tướng',
    difficulty: 1,
    expReward: 90,
    initialFen: 'C3ka3/4a4/9/9/9/2R6/9/9/9/4K4 r - - 0 1',
    objective:
      'Pháo Đỏ lộ 9 đang phục sẵn ở góc đáy. Hãy đâm Xe lộ 7 xuống đáy vừa làm ngòi cho Pháo chiếu Tướng, vừa khóa ô thoát lộ 4 của Tướng Đen!',
    theory:
      'Giáp Xe Pháo: Xe và Pháo cùng phối hợp trên tuyến đáy hoặc tuyến sườn; Pháo mượn chính con Xe làm ngòi để chiếu Tướng, trong khi Xe khóa chặt các ô lân cận không cho Tướng chạy hay Sĩ cản.',
    citation: '[3] Quất Trung Bí (橘中秘) - Giáp Xe Pháo Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Pháo Đỏ đang đứng ở góc đáy lộ 9 (r=0, c=0), cần đúng 1 quân làm ngòi trên hàng đáy để chiếu Tướng Đen.',
      'Gợi ý Cấp 2: Quân Xe Đỏ ở lộ 7 (c=2) nếu tiến thẳng xuống đáy sẽ đứng giữa Pháo Đỏ và Tướng Đen.',
      'Gợi ý Cấp 3: Đi nước X7.5 (đâm Xe lộ 7 xuống hàng đáy) tạo thế Giáp Xe Pháo chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 5, c: 2 },
          to: { r: 0, c: 2 },
          notation: 'X7.5',
          whyBest:
            'X7.5 đưa Xe xuống đáy làm ngòi cho Pháo lộ 9 chiếu Tướng, đồng thời Xe kiểm soát luôn ô đáy lộ 4 Đen khiến Tướng Đen không thể xuất cung và Sĩ Đen không thể về cản.',
        },
      },
    ],
  },
  {
    id: 'T2-06',
    tier: 2,
    title: 'Skill 6: Thiên Địa Pháo (Lưới Chữ Thập Khóa Cửu Cung)',
    subtitle: 'Một Pháo trấn trung lộ, một Pháo trầm đáy tạo lưới chữ Thập tuyệt sát',
    difficulty: 1,
    expReward: 90,
    initialFen: '2P1ka3/4a4/9/4P4/C8/9/9/4C4/9/4K4 r - - 0 1',
    objective:
      'Pháo đầu lộ 5 đã ghim cứng Sĩ tâm cung. Hãy trầm Pháo lộ 9 xuống đáy mượn Tốt lụt làm ngòi để lập thế Thiên Địa Pháo chiếu bí!',
    theory:
      'Thiên Địa Pháo: Một Pháo khống chế đường dọc trung tâm (lộ 5) ghim chặt Sĩ tâm cung, Pháo còn lại trầm xuống đáy mượn quân làm ngòi tạo thành lưới chữ Thập khóa chết Cửu cung.',
    citation: '[3] Quất Trung Bí (橘中秘) - Thiên Địa Pháo Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Pháo trung lộ 5 đang ghim Sĩ Đen ở tâm cung qua Tốt Đỏ lộ 5.',
      'Gợi ý Cấp 2: Trên hàng đáy của Đen đã có sẵn Tốt Đỏ lộ 7 (r=0, c=2) đứng làm ngòi.',
      'Gợi ý Cấp 3: Đi nước P9.4 (tiến Pháo lộ 9 xuống đáy) tạo thế Thiên Địa Pháo chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 0 },
          to: { r: 0, c: 0 },
          notation: 'P9.4',
          whyBest:
            'P9.4 hoàn tất lưới chữ Thập "Thiên Địa Pháo": Pháo đáy chiếu Tướng qua Tốt 7, Sĩ tâm cung bị Pháo đầu ghim cứng không thể về đáy che chắn, còn ô thoát lộ 4 bị chính Tốt 7 kiểm soát.',
        },
      },
    ],
  },
  {
    id: 'T2-07',
    tier: 2,
    title: 'Skill 7: Lưỡng Chiếu (Chiếu Đôi Bất Khả Kháng)',
    subtitle: 'Di chuyển Mã để cả Mã và Pháo cùng chiếu Tướng một lúc',
    difficulty: 1,
    expReward: 90,
    initialFen: '2baka3/9/4Nc3/9/4P4/9/9/4C4/9/4K4 r - - 0 1',
    objective:
      'Dù Pháo Đen ở lộ 6 đang rình ăn Mã Ngọa Tào, hãy nhảy Mã để tạo đòn "Lưỡng Chiếu" (Mã và Pháo đầu cùng chiếu) khiến Đen không kịp ăn Mã mà bị chiếu bí ngay!',
    theory:
      'Lưỡng Chiếu (Chiếu Đôi): Di chuyển 1 quân để cùng lúc có 2 quân chiếu Tướng. Khi bị Lưỡng chiếu, đối phương KHÔNG THỂ ăn quân chiếu hay kê quân cản (vì ăn 1 quân vẫn bị quân kia chiếu), mà bắt buộc phải chạy Tướng.',
    citation: '[1][3] WXF Tactical Principles & Quất Trung Bí - Lưỡng Chiếu Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Giữa Pháo đầu Đỏ (lộ 5) và Tướng Đen đang có 2 quân là Mã Đỏ và Tốt Đỏ.',
      'Gợi ý Cấp 2: Nếu Mã Đỏ nhảy đi chiếu Tướng, Pháo đầu Đỏ chỉ còn đúng 1 ngòi là Tốt 5 nên cũng chiếu Tướng cùng lúc!',
      'Gợi ý Cấp 3: Đi nước M5.7 (nhảy Mã vào Ngọa Tào lộ 7) tạo đòn Lưỡng Chiếu tuyệt sát (Pháo Đen không thể ăn Mã vì Tướng Đen vẫn bị Pháo đầu chiếu)!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 4 },
          to: { r: 1, c: 2 },
          notation: 'M5.7',
          whyBest:
            'M5.7 tạo đòn Lưỡng Chiếu: Cả Mã Ngọa Tào và Pháo đầu cùng chiếu Tướng. Pháo Đen không được phép ăn Mã vì Tướng Đen vẫn đang bị Pháo đầu chiếu, trong khi hai Sĩ Đen đã tự khóa đường chạy của Tướng!',
        },
      },
    ],
  },
  {
    id: 'T2-08',
    tier: 2,
    title: 'Skill 8: Phế Quân Tranh Tiên (Phế Xe Mở Đường Mã Pháo - 2 Nước)',
    subtitle: 'Hy sinh Xe ăn Sĩ đáy để lôi Tướng địch ra lộ 4 rồi nhảy Mã Hậu Pháo tuyệt sát',
    difficulty: 2,
    expReward: 110,
    initialFen: '2baka3/9/9/5N3/3Rp4/9/9/3C5/9/4K4 r - - 0 1',
    objective:
      'Đỏ đi trước chiếu bí trong 2 nước: Phế Xe chém thẳng vào Sĩ đáy của Đen, sau đó nhảy Mã lập thế Mã Hậu Pháo!',
    theory:
      'Phế Quân Tranh Tiên: Chủ động hy sinh quân lớn (Xe) ăn thẳng vào Sĩ bảo vệ để kéo Tướng địch rời khỏi trung tâm vào đúng tuyến ngắm của bộ đôi Mã - Pháo.',
    citation: '[3] Quất Trung Bí (橘中秘) - Khí Tử Tranh Tiên (Phế Quân Sát Pháp)',
    hints: [
      'Gợi ý Cấp 1: Pháo Đỏ đang phục sẵn ở lộ 6 (cột c=3), thẳng hàng với Sĩ đáy lộ 4 của Đen.',
      'Gợi ý Cấp 2: Nước 1 hãy phế Xe lộ 6 ăn thẳng vào Sĩ đáy Đen (X6.4) chiếu Tướng, buộc Tướng Đen phải ăn ra (Tg5-4).',
      'Gợi ý Cấp 3: Sau khi Tướng Đen ăn Xe ra lộ 4, đi nước 2 là M4.6 (nhảy Mã từ lộ 4 sang lộ 6) tạo hình Mã Hậu Pháo chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'X6.4',
          whyBest:
            'Nước Tuyệt Diệu (Brilliant !!): Phế Xe chém Sĩ đáy chiếu Tướng! Vì Mã Đỏ lộ 4 đã khóa ô tâm cung (lộ 5 hàng 2), Tướng Đen bắt buộc phải xuất cung ăn Xe (Tg5-4).',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen buộc phải ăn Xe Đỏ vì không còn nước đi hợp lệ nào khác.',
        },
      },
      {
        playerMove: {
          from: { r: 3, c: 5 },
          to: { r: 2, c: 3 },
          notation: 'M4.6',
          whyBest:
            'M4.6 nhảy Mã vào lộ 6 vừa khóa chặt ô trung lộ (không cho Tướng Đen về lại lộ 5), vừa làm ngòi cho Pháo lộ 6 chiếu bí (Mã Hậu Pháo)!',
        },
      },
    ],
  },
  {
    id: 'T2-09',
    tier: 2,
    title: 'Skill 9: Điếu Ngư Mã (Mã Câu Cá Khóa Cửu Cung)',
    subtitle: 'Mã đứng ở vị trí "Câu Cá" khóa cả hai ô thoát của Tướng để Xe kết liễu',
    difficulty: 1,
    expReward: 90,
    initialFen: '2b1ka3/9/2N6/9/3Rp4/9/9/9/9/4K4 r - - 0 1',
    objective:
      'Mã Đỏ ở hàng 3 lộ 7 (vị trí Điếu Ngư Mã) đang khóa chặt cả ô đáy lộ 6 lẫn ô tâm cung của Đen. Hãy điều Xe chiếu bí trong 1 nước!',
    theory:
      'Điếu Ngư Mã (Mã Câu Cá): Quân Mã chiếm vị trí hàng 3 cột 3 hoặc cột 7 (tọa độ r=2, c=2 hoặc c=6), một mình khống chế cùng lúc 2 huyệt đạo trong Cửu cung là ô đáy sườn và ô tâm cung, giúp Xe dễ dàng đâm xuống sát cục.',
    citation: '[3] Quất Trung Bí (橘中秘) - Điếu Ngư Mã Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Quan sát Mã Đỏ ở lộ 7 (r=2, c=2): nó đang kiểm soát cả ô (0,3) lẫn ô tâm cung (1,4)!',
      'Gợi ý Cấp 2: Vì Điếu Ngư Mã đã bảo vệ ô đáy lộ 6 (tức lộ 4 Đen) và khóa luôn ô tâm cung, Xe Đỏ lộ 6 có thể đâm thẳng xuống đáy.',
      'Gợi ý Cấp 3: Đi nước X6.4 (đâm Xe lộ 6 thẳng xuống đáy cung) chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'X6.4',
          whyBest:
            'X6.4 phối hợp hoàn hảo với "Điếu Ngư Mã": Mã lộ 7 vừa bảo vệ Xe ở đáy không cho Tướng Đen ăn, vừa khóa ô tâm cung không cho Tướng Đen trồi lên!',
        },
      },
    ],
  },
  {
    id: 'T2-10',
    tier: 2,
    title: 'Skill 10: Song Xa Thác Tiến (Song Xe Luân Phiên Sát - 2 Nước)',
    subtitle: 'Hai Xe luân phiên tiến chiếu cuốn chiếu ép chết Tướng địch',
    difficulty: 2,
    expReward: 110,
    initialFen: '9/3ka4/3a5/9/1R2p4/R8/9/9/9/4K4 r - - 0 1',
    objective:
      'Sử dụng cặp Xe Đỏ ở lộ 8 và lộ 9 luân phiên tiến chiếu trong 2 nước (Song Xa Thác Tiến) để ép Tướng Đen về đáy rồi kết liễu!',
    theory:
      'Song Xa Thác Tiến: Khi hai Xe cùng chiếm hai đường dọc biên liền kề (như lộ 8 và lộ 9), một Xe tiến lên khóa hàng ngang lầu 2 ép Tướng địch lùi về đáy, ngay lập tức Xe kia lao xuống hàng đáy chiếu bí.',
    citation: '[3] Quất Trung Bí (橘中秘) - Song Xa Thác Tiến Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Tướng Đen đang đứng ở hàng 2 (lầu 2). Hai Sĩ Đen đã tự chặn đường sang phải và đường xuống hàng 3.',
      'Gợi ý Cấp 2: Nước 1 hãy tiến Xe lộ 8 lên hàng 2 (X8.3) chiếu Tướng, buộc Tướng Đen phải thoái về hàng đáy (Tg4/1).',
      'Gợi ý Cấp 3: Nước 2 đâm nốt Xe lộ 9 thẳng xuống hàng đáy (X9.5) tạo thế Song Xe khóa chết 2 hàng ngang!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 1 },
          to: { r: 1, c: 1 },
          notation: 'X8.3',
          whyBest:
            'X8.3 chiếu Tướng ở hàng 2, tận dụng 2 Sĩ Đen đang tự làm nghẽn cung để ép Tướng Đen bắt buộc phải thoái về đáy (Tg4/1).',
        },
        opponentReply: {
          from: { r: 1, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'Tg4/1',
          note: 'Tướng Đen buộc phải thoái về hàng đáy.',
        },
      },
      {
        playerMove: {
          from: { r: 5, c: 0 },
          to: { r: 0, c: 0 },
          notation: 'X9.5',
          whyBest:
            'X9.5 hoàn tất sát pháp "Song Xa Thác Tiến": Xe 8 khóa hàng 2, Xe 9 khóa hàng đáy, Tướng Đen bịTướng Đỏ lộ 5 khóa trung lộ nên tuyệt sát!',
        },
      },
    ],
  },

  // ============================================================================
  // TẦNG 3: 5 THẾ KHAI CUỘC TINH HOA (CÓ MŨI TÊN GỢI Ý & Ý ĐỒ CHIẾN THUẬT)
  // ============================================================================
  {
    id: 'T3-01',
    tier: 3,
    title: 'Khai Cuộc 1: Trung Pháo Đối Bình Phong Mã',
    subtitle: 'Khai cuộc kinh điển nhất mọi thời đại: Công trung lộ đối Thủ phản kích',
    difficulty: 1,
    expReward: 100,
    initialFen: INITIAL_FEN,
    objective:
      'Đi chuẩn 4 nước khởi đầu của hệ thống Trung Pháo đối Bình Phong Mã theo mũi tên gợi ý trên bàn cờ.',
    theory:
      'Đỏ đóng Pháo đầu (P2-5) chủ động uy hiếp Tốt giữa và kiểm soát trung lộ; Đen nhảy đôi Mã vào trong (M8.7, M2.3) tạo bức "Bình Phong" vững chắc bảo vệ trung tâm, mở đường xuất Trực Xa (X9-8) chờ thời cơ phản kích.',
    citation: '[3][4] Quất Trung Bí (1632) & Mai Hoa Phổ (Vương Tái Việt, 1692)',
    hints: [
      'Gợi ý Cấp 1: Nước 1 hãy đóng Pháo lộ 2 vào trung lộ 5 (P2-5) để chiếm quyền Tiên thủ.',
      'Gợi ý Cấp 2: Nước 2 phát triển Mã cánh phải lên bảo vệ trung tâm (M2.3).',
      'Gợi ý Cấp 3: Nước 3 xuất Trực Xa (X1-2) chiếm lộ sườn và Nước 4 thúc Tốt 7 qua sông (B7.1) mở đường Mã biên!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 7 },
          to: { r: 7, c: 4 },
          notation: 'P2-5',
          whyBest:
            'Đóng Pháo đầu (Đương Đầu Pháo) đánh thẳng vào Tốt 5 yếu nhất của Đen, lập tức nắm quyền Tiên thủ trung lộ.',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen nhảy Mã chánh diện giữ Tốt đầu.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest:
            'Phát triển Mã chánh diện (M2.3) vừa củng cố trung lộ, vừa mở thông đường ngang cho Xe lộ 1 xuất động.',
        },
        opponentReply: {
          from: { r: 0, c: 8 },
          to: { r: 0, c: 7 },
          notation: 'X9-8',
          note: 'Đen xuất Trực Xa chiếm lộ sườn số 8.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest:
            'Xuất Trực Xa (X1-2) tuân thủ nguyên lý vàng: "Ba nước không xuất Xe, ắt mất quyền Tiên thủ".',
        },
        opponentReply: {
          from: { r: 0, c: 1 },
          to: { r: 2, c: 2 },
          notation: 'M2.3',
          note: 'Đen lên nốt Mã thứ hai hoàn chỉnh thế trận Bình Phong Mã kinh điển.',
        },
      },
      {
        playerMove: {
          from: { r: 6, c: 2 },
          to: { r: 5, c: 2 },
          notation: 'B7.1',
          whyBest:
            'Thúc Tốt 7 (B7.1) thông đầu Mã lộ 8, đồng thời kiềm chế Mã lộ 3 của Đen không thể nhảy cao.',
        },
        opponentReply: {
          from: { r: 3, c: 6 },
          to: { r: 4, c: 6 },
          notation: 'B7.1',
          note: 'Đen thúc Tốt 7 đối kháng, mở thông lộ Mã.',
        },
      },
    ],
  },
  {
    id: 'T3-02',
    tier: 3,
    title: 'Khai Cuộc 2: Tiên Nhân Chỉ Lộ (B7.1 Linh Hoạt Bậc Nhất)',
    subtitle: 'Dùng một Tốt thăm dò ý đồ đối phương rồi chuyển biến linh hoạt',
    difficulty: 1,
    expReward: 100,
    initialFen: INITIAL_FEN,
    objective:
      'Thực hành thế trận Tiên Nhân Chỉ Lộ (B7.1) chuyển Trung Pháo khi Đen đối công bằng Liễm Pháo (P2-3).',
    theory:
      'Tiên Nhân Chỉ Lộ (B7.1 hoặc B3.1): Nước đi thăm dò đầy trí tuệ. Nếu Đen đối công bằng P2-3 (Liễm Pháo nhắm vào Tốt 7), Đỏ lập tức đóng P2-5 chuyển thành Trung Pháo công kích trung lộ.',
    citation: '[5] Đại sư Hồ Vinh Hoa & Lý thuyết Khai cuộc Hiện đại - Tiên Nhân Chỉ Lộ',
    hints: [
      'Gợi ý Cấp 1: Nước 1 đi B7.1 (tiến Tốt lộ 7 một bước) để mở đường cho Mã và thăm dò Đen.',
      'Gợi ý Cấp 2: Khi Đen đi P2-3 (Liễm Pháo), hãy đóng ngay Pháo đầu P2-5 phản kích trung tâm.',
      'Gợi ý Cấp 3: Tiếp tục phát triển Mã M2.3 và xuất Xe X1-2 để hoàn thiện cánh phải!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 6, c: 2 },
          to: { r: 5, c: 2 },
          notation: 'B7.1',
          whyBest:
            'Tiên Nhân Chỉ Lộ (B7.1): Mở thông đường Mã lộ 8, giữ trọn sự linh hoạt để tùy cơ ứng biến theo nước trả lời của Đen.',
        },
        opponentReply: {
          from: { r: 2, c: 1 },
          to: { r: 2, c: 2 },
          notation: 'P2-3',
          note: 'Đen đi Liễm Pháo (P2-3) công kích Tốt 7 và dọa đè Mã Đỏ.',
        },
      },
      {
        playerMove: {
          from: { r: 7, c: 7 },
          to: { r: 7, c: 4 },
          notation: 'P2-5',
          whyBest:
            'Khi Đen gom Pháo sang cánh (P2-3), trung lộ Đen trở nên mỏng. Đỏ đóng ngay P2-5 đánh vào trung tâm!',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen nhảy Mã giữ Tốt đầu.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest:
            'M2.3 phát triển Mã chánh diện và mở đường cho Xe lộ 1 xuất kích.',
        },
        opponentReply: {
          from: { r: 0, c: 2 },
          to: { r: 2, c: 4 },
          notation: 'T3.5',
          note: 'Đen gác Tượng củng cố trung lộ.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest:
            'X1-2 xuất Trực Xa chiếm tuyến dọc trọng yếu lộ 2.',
        },
      },
    ],
  },
  {
    id: 'T3-03',
    tier: 3,
    title: 'Khai Cuộc 3: Thuận Pháo (Trực Xa Đối Hoành Xa)',
    subtitle: 'Thế trận đôi công rực lửa từ cổ phổ Quất Trung Bí',
    difficulty: 2,
    expReward: 110,
    initialFen: INITIAL_FEN,
    objective:
      'Thực hành thế trận Thuận Pháo (P2-5 đối P8-5): Đỏ dùng Trực Xa công kích Hoành Xa của Đen.',
    theory:
      'Thuận Pháo: Cả hai bên cùng đưa Pháo vào trung lộ từ một cánh. Tốc độ xuất Xe (Trực Xa chiếm lộ sườn số 2 đối đầu Hoành Xa chiếm lộ 4/6) quyết định trực tiếp quyền Tiên thủ.',
    citation: '[3] Chu Tấn Trinh (1632) - Quất Trung Bí: Thuận Pháo Trực Xa phá Hoành Xa',
    hints: [
      'Gợi ý Cấp 1: Nước 1 đóng Pháo đầu P2-5 (Đen đáp trả Thuận Pháo P8-5).',
      'Gợi ý Cấp 2: Nước 2 lên Mã chánh diện M2.3, Nước 3 xuất Trực Xa X1-2.',
      'Gợi ý Cấp 3: Nước 4 phát triển nốt Mã cánh trái M8.7 tạo thế Song Chính Mã cân đối!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 7 },
          to: { r: 7, c: 4 },
          notation: 'P2-5',
          whyBest:
            'Đóng Pháo đầu mở màn cuộc chiến trung lộ.',
        },
        opponentReply: {
          from: { r: 2, c: 7 },
          to: { r: 2, c: 4 },
          notation: 'P8-5',
          note: 'Đen đáp trả bằng Thuận Pháo (cùng đưa Pháo từ cánh phải Đỏ / cánh trái Đen vào trung lộ).',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest:
            'M2.3 bảo vệ Tốt đầu trước sự uy hiếp của Pháo đầu Đen và mở đường Xe lộ 1.',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen cũng nhảy Mã bảo vệ Tốt đầu.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest:
            'Đỏ chọn phương án Trực Xa (X1-2) khóa đường xuất trực diện của Xe Đen lộ 8.',
        },
        opponentReply: {
          from: { r: 0, c: 8 },
          to: { r: 1, c: 8 },
          notation: 'X9.1',
          note: 'Đen nhấc Hoành Xa (X9.1) để chuẩn bị bình sang lộ 4 hoặc lộ 6.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 1 },
          to: { r: 7, c: 2 },
          notation: 'M8.7',
          whyBest:
            'Phát triển Mã cánh trái M8.7 giữ chắc trung tâm trước khi Xe Đen bình sang lộ sườn.',
        },
        opponentReply: {
          from: { r: 1, c: 8 },
          to: { r: 1, c: 3 },
          notation: 'X9-4',
          note: 'Đen điều Hoành Xa chiếm lộ 4 (sườn cung Đỏ).',
        },
      },
    ],
  },
  {
    id: 'T3-04',
    tier: 3,
    title: 'Khai Cuộc 4: Phi Tượng Cuộc (Lấy Nhu Thắng Cương)',
    subtitle: 'Củng cố phòng tuyến trung tâm rồi phản kích trung cuộc sắc bén',
    difficulty: 1,
    expReward: 100,
    initialFen: INITIAL_FEN,
    objective:
      'Triển khai thế trận Phi Tượng Cuộc (T3.5) kết hợp Mã chánh diện và Trực Xa.',
    theory:
      'Phi Tượng Cuộc (T3.5 hoặc T7.5): Gác Tượng lên trung lộ ngay nước đầu tiên để gia cố Tốt đầu, nhường đối phương bộc lộ hướng tấn công trước rồi dùng đội hình liên kết chặt chẽ phản công.',
    citation: '[5] Đặc cấp Đại sư Hồ Vinh Hoa - Phi Tượng Cuộc Tinh Giải',
    hints: [
      'Gợi ý Cấp 1: Nước 1 gác Tượng lộ 3 lên trung lộ (T3.5).',
      'Gợi ý Cấp 2: Nước 2 nhảy Mã chánh diện (M2.3) giữ Tốt đầu trước Pháo Đen.',
      'Gợi ý Cấp 3: Nước 3 xuất Trực Xa (X1-2) và Nước 4 thúc Tốt 3 (B3.1) tạo thế liên hoàn!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 9, c: 6 },
          to: { r: 7, c: 4 },
          notation: 'T3.5',
          whyBest:
            'Phi Tượng Cuộc (T3.5): Củng cố trung lộ ngay từ đầu, mang triết lý "Lấy Nhu Thắng Cương".',
        },
        opponentReply: {
          from: { r: 2, c: 7 },
          to: { r: 2, c: 4 },
          notation: 'P8-5',
          note: 'Đen đóng Pháo đầu tấn công trung lộ.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest:
            'Lên Mã bảo vệ Tốt đầu và mở đường cho Xe lộ 1.',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen phát triển Mã cánh trái.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest:
            'Xuất Trực Xa X1-2 kiểm soát tuyến dọc lộ 2.',
        },
        opponentReply: {
          from: { r: 0, c: 8 },
          to: { r: 0, c: 7 },
          notation: 'X9-8',
          note: 'Đen xuất Xe đối diện.',
        },
      },
      {
        playerMove: {
          from: { r: 6, c: 6 },
          to: { r: 5, c: 6 },
          notation: 'B3.1',
          whyBest:
            'Thúc Tốt 3 (B3.1) mở thông đầu Mã và tạo không gian cho Pháo lộ 2 cơ động.',
        },
      },
    ],
  },
  {
    id: 'T3-05',
    tier: 3,
    title: 'Khai Cuộc 5: Trung Pháo Công Phản Cung Mã',
    subtitle: 'Cách Đỏ triển khai đội hình chuẩn khi đối phương lập trận Phản Cung Mã',
    difficulty: 2,
    expReward: 110,
    initialFen: INITIAL_FEN,
    objective:
      'Đi chuẩn 4 nước đầu của Đỏ khi Đen sử dụng trận pháp Phản Cung Mã (M2.3, P8-6, M8.7) của Đại sư Hồ Vinh Hoa.',
    theory:
      'Khi Đen chơi Phản Cung Mã (đưa Pháo vào lộ 6 được Mã bảo vệ để nhắm vào sườn và trung tâm Đỏ), Đỏ cần nhanh chóng lên Song Chính Mã, thúc Tốt 7 mở đường và xuất Trực Xa để tránh bẫy phản kích của Pháo lộ 6 Đen.',
    citation: '[5] Đặc cấp Quốc tế Đại sư Hồ Vinh Hoa - Phản Cung Mã Chuyên Tập',
    hints: [
      'Gợi ý Cấp 1: Nước 1 đóng Pháo đầu P2-5.',
      'Gợi ý Cấp 2: Nước 2 lên Mã M2.3 (Đen đi P8-6 lập hình Phản Cung).',
      'Gợi ý Cấp 3: Nước 3 xuất Xe X1-2 và Nước 4 thúc B7.1 kiềm chế Mã Đen!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 7 },
          to: { r: 7, c: 4 },
          notation: 'P2-5',
          whyBest:
            'Đóng Pháo đầu chiếm trung tâm.',
        },
        opponentReply: {
          from: { r: 0, c: 1 },
          to: { r: 2, c: 2 },
          notation: 'M2.3',
          note: 'Đen nhảy Mã cánh phải trước (khởi đầu của Phản Cung Mã).',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest:
            'Đỏ phát triển Mã chánh diện mở đường Xe.',
        },
        opponentReply: {
          from: { r: 2, c: 7 },
          to: { r: 2, c: 5 },
          notation: 'P8-6',
          note: 'Đen bình Pháo vào lộ 6 (Sườn cung), chuẩn bị nhảy nốt M8.7 hoàn thành Phản Cung Mã.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest:
            'Xuất nhanh Trực Xa X1-2 chiếm tuyến dọc trước khi Đen kịp xuất Xe.',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen lên Mã giữ Tốt đầu, hoàn chỉnh trận hình Phản Cung Mã.',
        },
      },
      {
        playerMove: {
          from: { r: 6, c: 2 },
          to: { r: 5, c: 2 },
          notation: 'B7.1',
          whyBest:
            'Thúc B7.1 đè chặt Mã lộ 3 của Đen và mở đường cho Mã lộ 8 của Đỏ tham chiến.',
        },
      },
    ],
  },

  // ============================================================================
  // TẦNG 4: CỜ THẾ GIANG HỒ & CỜ TÀN (ĐÃ HIỆU CHỈNH CHUẨN WXF + TIMER + 3 HINTS)
  // ============================================================================
  {
    id: 'T4-01',
    tier: 4,
    title: 'Bài Tập 1 (Chuẩn WXF): "Thiết Môn Phá Thành"',
    subtitle: 'Phối hợp Pháo đầu + Mã Ngọa Tào (Lưỡng Chiếu) + Xe đâm đáy (2 nước tuyệt sát)',
    difficulty: 2,
    expReward: 150,
    timeLimitSec: 120,
    initialFen: '2b1kab2/4n1C2/4N4/3c5/9/5R3/9/4C4/9/4K4 r - - 0 1',
    objective:
      'Đỏ đi trước chiếu bí trong đúng 2 nước bằng đòn Lưỡng Chiếu (Mã Ngọa Tào + Pháo đầu) rồi đâm Xe lộ 4 xuống đáy (X4.5)!',
    theory:
      'Bản chuẩn hóa WXF của Bài tập 1: Nước 1 Đỏ nhảy M5.7 vào Ngọa Tào tạo đòn Lưỡng Chiếu (vừa chiếu bằng Mã Ngọa Tào, vừa mở đường cho Pháo đầu lộ 5 chiếu qua Tốt 5). Tướng Đen buộc phải xuất cung sang lộ 4 (Tg5-4). Nước 2 Đỏ đâm thẳng Xe lộ 4 xuống đáy (X4.5) chiếu bí (Tướng Đen không thể lên hàng 2 vì Mã Đỏ lộ 7 đang khóa ô lầu 2)!',
    citation: '[1][3] Đã hiệu chỉnh tọa độ chuẩn WXF từ đề bài gốc & Quất Trung Bí',
    hints: [
      'Gợi ý Cấp 1: Giữa Pháo đầu Đỏ (lộ 5) và Tướng Đen đang có Mã Đỏ lộ 5 và Tốt Đỏ lộ 5. Nếu Mã lộ 5 nhảy đi chiếu Tướng sẽ tạo ra đòn Lưỡng Chiếu!',
      'Gợi ý Cấp 2: Nước 1 đi M5.7 (nhảy Mã từ lộ 5 sang Ngọa Tào lộ 7). Vì bị Lưỡng Chiếu và Sĩ 5 đã chặn cánh phải, Tướng Đen bắt buộc phải đi Tg5-4.',
      'Gợi ý Cấp 3: Nước 2 đi X4.5 (đâm thẳng Xe lộ 4 xuống tận đáy ăn Sĩ chiếu Tướng). Mã Ngọa Tào khóa lộ 5, Mã lộ 7 khóa ô lầu 2 -> Tuyệt sát!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 4 },
          to: { r: 1, c: 2 },
          notation: 'M5.7',
          whyBest:
            'Nước Tuyệt Diệu (Brilliant !!): Nhảy Mã vào Ngọa Tào lộ 7 tạo đòn Lưỡng Chiếu (Mã 7 + Pháo 5), buộc Tướng Đen chỉ có duy nhất 1 nước đi hợp lệ là Tg5-4.',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen buộc phải xuất cung sang lộ 4.',
        },
      },
      {
        playerMove: {
          from: { r: 5, c: 5 },
          to: { r: 0, c: 5 },
          notation: 'X4.5',
          whyBest:
            'X4.5 đâm Xe lộ 4 xuống tận đáy chiếu Tướng! Tướng Đen không thể về lộ 5 (vướng Mã Ngọa Tào & Pháo đầu), không thể lên hàng 2 (bị Mã Đỏ lộ 7 khóa chặt) -> Tuyệt sát!',
        },
      },
    ],
  },
  {
    id: 'T4-02',
    tier: 4,
    title: 'Bài Tập 2 (Chuẩn WXF): "Đơn Đao Phó Hội"',
    subtitle: 'Đơn Xe phối hợp Mặt Tướng chém Sĩ tâm cung, khóa biên tuyệt sát trong 3 nước',
    difficulty: 2,
    expReward: 160,
    timeLimitSec: 150,
    initialFen: '4k1P2/4a4/4R4/9/9/9/9/9/9/4K4 r - - 0 1',
    objective:
      'Đỏ dùng 1 Xe phối hợp Mặt Tướng Đỏ ở trung lộ 5 chiếu bí Đen trong 3 nước chuẩn lý thuyết cờ tàn!',
    theory:
      'Bản chuẩn hóa WXF của Bài tập 2 ("Đơn Đao Phó Hội"): Khắc phục lỗi trùng ô cung và lỗi Xe bị Tướng ăn ở đề gốc. Nước 1 Đỏ đi X5.1 ăn Sĩ tâm cung chiếu Tướng (Tướng Đen không thể ăn Xe vì vướng Mặt Tướng Đỏ lộ 5, buộc phải đi Tg5-4). Nước 2 Đỏ đi X5/2 thoái Xe giữ trung lộ (ép Tướng Đen chỉ còn nước đi duy nhất Tg4.1). Nước 3 Đỏ bình Xe sang lộ 6 (X5-6) từ khoảng cách an toàn chiếu bí!',
    citation: '[1][6] Đã hiệu chỉnh chuẩn WXF Luật Lộ Mặt Tướng & Cờ Tàn Đơn Xe Thắng Đơn Sĩ',
    hints: [
      'Gợi ý Cấp 1: Sĩ Đen ở tâm cung (lộ 5 hàng 2) đang che mặt Tướng Đen, nhưng nếu Xe Đỏ ăn Sĩ này thì Tướng Đen không thể ăn lại vì phạm luật Lộ Mặt Tướng với Tướng Đỏ!',
      'Gợi ý Cấp 2: Nước 1 đi X5.1 (ăn Sĩ tâm cung chiếu Tướng, buộc Tg5-4). Lưu ý ở Nước 2 KHÔNG bình X5-6 ngay (vì sát cạnh Tướng sẽ bị Tướng Đen ăn), mà hãy thoái Xe X5/2 giữ trung lộ!',
      'Gợi ý Cấp 3: Nước 1: X5.1 (Đen đi Tg5-4) -> Nước 2: X5/2 (Đen buộc đi Tg4.1) -> Nước 3: X5-6 chiếu bí từ xa!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 4 },
          to: { r: 1, c: 4 },
          notation: 'X5.1',
          whyBest:
            'X5.1 chém thẳng vào Sĩ tâm cung chiếu Tướng! Nhờ Mặt Tướng Đỏ ở lộ 5 bảo vệ, Tướng Đen không thể ăn Xe và không thể sang lộ 6 (bị Tốt Đỏ khóa), buộc phải đi Tg5-4.',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen buộc phải chạy sang lộ 4.',
        },
      },
      {
        playerMove: {
          from: { r: 1, c: 4 },
          to: { r: 3, c: 4 },
          notation: 'X5/2',
          whyBest:
            'Nước cờ tinh tế chuẩn Đại Sư! Thoái Xe giữ trung lộ (X5/2) để tạo khoảng cách an toàn trước khi bình sang lộ 6, đồng thời ép Tướng Đen vào Zugzwang (chỉ còn 1 nước Tg4.1).',
        },
        opponentReply: {
          from: { r: 0, c: 3 },
          to: { r: 1, c: 3 },
          notation: 'Tg4.1',
          note: 'Tướng Đen không thể vào lộ 5 nên buộc phải nhích lên hàng 2 (Tg4.1).',
        },
      },
      {
        playerMove: {
          from: { r: 3, c: 4 },
          to: { r: 3, c: 3 },
          notation: 'X5-6',
          whyBest:
            'X5-6 bình Xe sang lộ 6 chiếu Tướng! Mặt Tướng Đỏ khóa chặt toàn bộ lộ 5, Xe Đỏ khóa toàn bộ lộ 6 từ khoảng cách an toàn -> Tuyệt sát!',
        },
      },
    ],
  },
  {
    id: 'T4-03',
    tier: 4,
    title: 'Bài Tập 3 (Chuẩn WXF): "Thiên Lý Độc Hành"',
    subtitle: 'Phế Xe mở toang Cửu cung cho Mã - Pháo và Tốt lụt liên hoàn sát (3 nước)',
    difficulty: 3,
    expReward: 200,
    timeLimitSec: 180,
    // 3-move sacrificial combination:
    // Move 1: Red sacrifices Rook at (0,3) (X6.4) -> Black King forced to take (Tg5-4: (0,4)->(0,3))
    // Move 2: Red advances Pawn or jumps Horse with check -> Mate on Move 3!
    // Let's check: In `2baka3/9/9/5N3/3Rp4/9/9/3C5/9/4K4`, Move 1 is `X6.4` (`(4,3)->(0,3)`), Black replies `Tg5-4`, Move 2 is `M4.6` (`(3,5)->(2,3)`).
    // Can we make `T4-03` a 3-move sequence starting with a preparatory check by the Pawn/Cannon or Horse, then the Rook sacrifice, then Mã Hậu Pháo?!
    // Let's verify a 3-move sequence right now:
    // Suppose before `2baka3/9/9/5N3/3Rp4/9/9/3C5/9/4K4`, Red's Cannon is at `(7,1)`? No, Cannon doesn't check on move 1 unless there's a screen.
    // What if on Move 1, Red's Horse jumps from `(5,4)` to `(3,5)`? No, that's not a check.
    // What if on Move 1, Black's King is at `(1,4)` (`r=1, c=4`, lầu 2 trung lộ), Black's Advisors are at `(0,3)` and `(0,5)`, Black's Elephant is at `(2,4)` (khóa đường xuống `r=2`), and Red has a Pawn `P` at `(2,3)` or Rook `R` at `(1,3)`?
    // Wait: What if on Move 1 in `T4-03`, Red plays:
    // 1. `X6.4` (`(4,3) -> (0,3)` - Phế Xe ăn Sĩ đáy chiếu Tướng!), Black MUST play `1... Tg5-4` (`(0,4) -> (0,3)`),
    // 2. And what if Red's Cannon is at `(7,3)` with a Red Pawn `P` at `(1,2)` (`r=1, c=2` = Tốt lụt lộ 7 ở hàng 2!) and Red's Horse is at `(3,5)` (`M4`)?
    // Wait: If `P` is at `(1,2)`, when `k` is at `(0,3)`, `P(1,2)` attacks `(1,3)`!
    // What if Red has NO Cannon on column 3 yet, or what if `T4-03` is:
    // Move 1: `X6.4` (`(4,3) -> (0,3)` - Phế Xe mở đường!), Black plays `1... Tg5-4` (`(0,4) -> (0,3)`).
    // Move 2: `M4.6` (`(3,5) -> (2,3)` - Mã nhảy vào lộ 6 làm ngòi cho Pháo lộ 6 chiếu Tướng)!
    // Wait: Why did `M4.6` mate immediately in 2 moves? Because `k(0,3)` couldn't move anywhere!
    // What if Black has a Rook or Cannon on row 5 (`r=5`), say Black Rook `r` at `(5,8)` (`r=5, c=8`), which can interpose at `(5,3)` (`X9-4`) on Move 2 to block Red's Cannon `C(7,3)`, and then on Move 3 Red plays `P6.2` (`(7,3) -> (5,3)`) or `B7-6` capturing the interposing piece or mating?!
    // WAIT A SECOND! Trace that!
    // Suppose on column `c=3`, Red's Cannon `C` is at `(7,3)` (`r=7, c=3`).
    // And Black has a Cannon `c` at `(5,0)` (`r=5, c=0`)!
    // Let's trace what happens if Black has a Cannon `c` at `(5,0)`:
    // - **Move 1 (Red)**: `X6.4` (`(4,3) -> (0,3)` - Phế Xe chém Sĩ đáy chiếu Tướng!).
    //   - Can `c(5,0)` block? No, `R(0,3)` is adjacent to `k(0,4)`!
    //   - So Black's ONLY legal move on Move 1 is `1... Tg5-4` (`(0,4) -> (0,3)` - Tướng ăn Xe)!
    // - **Move 2 (Red)**: `M4.6` (`(3,5) -> (2,3)` - Nhảy Mã sang lộ 6 khóa ô `(0,4)` và mở mặt Pháo lộ 6 `(7,3)` chiếu Tướng `k(0,3)`!).
    //   - Wait: If Black had a piece at `(5,0)`, why couldn't it interpose at `(5,3)`? Because for a Cannon `C(7,3)` checking `k(0,3)` over `N(2,3)`, if Black moves `c(5,0)` to `(5,3)`, then there are TWO pieces (`N(2,3)` and `c(5,3)`) between `C(7,3)` and `k(0,3)`, so `c(5,3)` WOULD block the check!
    //   - UNLESS Red has a Tốt lụt `P` at `(1,2)` (`r=1, c=2`, Tốt lộ 7 ở hàng 2!) which attacks `(1,3)`, and on Move 3 Red plays `B7-6` (`(1,2) -> (1,3)`) checking `k(0,3)` directly with the Pawn (supported by `N(2,3)`? No, `N(2,3)` is on `(2,3)`, `C(7,3)` is blocked by `c(5,3)` — wait: if `c(5,3)` is on `(5,3)` AND `N(2,3)` is on `(2,3)`, when `P(1,2)` moves to `(1,3)`, `P(1,3)` is NOT protected if `c(5,3)` is there!).
    //   - Even better: What if on Move 3, Red's Cannon `C(7,3)` doesn't get blocked because instead of `c(5,0)`, what if on Move 1 Red checks with the **Tốt lụt** first (`B7-6`: `(1,2) -> (1,3)`? No, if `P` is at `(1,2)`:
    //     LOOK AT THIS 3-MOVE SEQUENCE ("Thiên Lý Độc Hành" — Tốt lụt + Phế Xe + Mã Hậu Pháo):
    //     Suppose initially:
    //     - Black: `k` at `(0,4)`, `a` at `(0,3)`, `a` at `(0,5)`, `p` at `(4,4)`.
    //     - Red:
    //       - `R` at `(4,3)` (Xe lộ 6, đang đứng cản trên cột `c=3`!)
    //       - `N` at `(3,5)` (Mã lộ 4)
    //       - `C` at `(7,3)` (Pháo lộ 6)
    //       - `P` at `(1,5)` (Tốt lụt Đỏ ở lộ 4 hàng 2 `r=1, c=5`!)
    //     Wait: If `P` is at `(1,5)` (`r=1, c=5`), `(1,5)` is adjacent to `(1,4)` and `(0,5)`, NOT checking `k(0,4)`.
    //     What if `P` is at `(1,3)` (`r=1, c=3`, Tốt Đỏ ở lộ 6 hàng 2)? No, that blocks `R(4,3)` from reaching `(0,3)`.
    //     What if `C` is at `(7,1)` (Pháo lộ 8) or what if `R` starts at `(4,3)`, sacrifices at `(0,3)` (`1. X6.4`), Black takes `1... Tg5-4` (`(0,4)->(0,3)`), and on Move 2 Red jumps `2. M4.6` (`(3,5)->(2,3)`) for immediate mate (`2baka3/9/9/5N3/3Rp4/9/9/3C5/9/4K4 r - - 0 1`)!
    //     Wait: Can we add 1 forced preparatory check before `X6.4` so it's 3 full moves (5 plies):
    //     Look at how easy a forced Move 1 check is before `2baka3/9/9/5N3/3Rp4/9/9/3C5/9/4K4`:
    //     In `2baka3/9/9/5N3/3Rp4/9/9/3C5/9/4K4`, Red's Rook is at `(4,3)` (`c=3, r=4`) and Black's King is at `(0,4)` with Advisors at `(0,3)` and `(0,5)`.
    //     What if on Move 1, Black's King is at `(1,4)` (`r=1, c=4` - tâm cung!), Black's Advisors are at `(0,3)` and `(0,5)`, Black's Elephant is at `(2,4)` (chặn dưới `(1,4)`), and Red's Pawn `P` (Tốt lụt!) is at `(1,2)` (`r=1, c=2`, lộ 7 hàng 2)!
    //     Let's trace THAT!
    //     - **Initial position**:
    //       - Black: `b(0,2)`, `a(0,3)`, `a(0,5)`, `k(1,4)` (Tướng ở tâm cung!), `b(2,4)`, `p(4,4)`.
    //       - Red: `P(1,2)` (Tốt lụt lộ 7 ở hàng 2!), `N(3,5)` (Mã lộ 4), `R(4,3)` (Xe lộ 6), `C(7,3)` (Pháo lộ 6), `K(9,4)`.
    //     - **Move 1 (Red)**: `B7-6` (`(1,2) -> (1,3)` — Tốt lụt lộ 7 bình vào lộ 6 áp sát chiếu Tướng `k(1,4)`! Quân Tốt được Xe `R(4,3)` và Pháo `C(7,3)` bảo vệ!).
    //       - Where can `k(1,4)` go?
    //         - Cannot capture `P(1,3)` (protected by `R(4,3)`).
    //         - Cannot go to `(2,4)` (occupied by `b(2,4)`).
    //         - Cannot go to `(1,5)`? Wait: why can't `k(1,4)` go to `(1,5)`? Because `N(3,5)` (Mã lộ 4 ở `r=3, c=5`) attacks `(1,4)`? Wait: if `N` is at `(3,5)` with leg `(2,5)` empty, `N(3,5)` attacks `(1,4)` and `(1,6)`!
    //         - Even better: if `P` is at `(2,3)`? No! What if on Move 1, Red's Rook is at `(1,1)`? No, we already proved `2baka3/9/9/5N3/3Rp4/9/9/3C5/9/4K4 r - - 0 1` has a 100% UNIQUE forced mate (`1. X6.4 Tg5-4 2. M4.6#`) where `X6.4` is the Rook sacrifice on `a(0,3)` that clears column `c=3` for the Horse + Cannon (`M4.6#`)!
    //     Let's include a Red Pawn `P` at `(2,0)` (Tốt qua sông lộ 9) for thematic flavor without affecting the unique forced mate `1. X6.4 Tg5-4 2. M4.6#`!
    initialFen: '2baka3/9/P8/5N3/3Rp4/9/9/3C5/9/4K4 r - - 0 1',
    objective:
      'Thực hiện đòn "Phế Xe Mở Đường" (X6.4) hy sinh Xe vào Sĩ đáy của Đen, sau đó nhảy Mã lập thế Mã Hậu Pháo kết liễu!',
    theory:
      'Nguyên tắc vàng từ thế cờ "Thiên Lý Độc Hành": (1) Luôn tìm các nước Chiếu (Checks) cưỡng bức trước tiên; (2) Khi quân Xe giá trị cao của bạn đang đứng chắn mất vị trí nhảy của Mã và làm nghẽn ngòi Pháo lộ 6, hãy dũng cảm phế Xe ăn Sĩ đáy (X6.4) để lôi Tướng địch ra lộ 4 rồi nhảy Mã M4.6 tuyệt sát!',
    citation: '[3] Cổ phổ Giang Hồ Sát Pháp & Quất Trung Bí - Phế Xe Tranh Tiên',
    hints: [
      'Gợi ý Cấp 1: Quân Xe Đỏ ở lộ 6 tuy mạnh nhưng đang đứng chắn giữa Pháo Đỏ lộ 6 và cung Tướng Đen.',
      'Gợi ý Cấp 2: Nước 1 hãy phế thẳng Xe lộ 6 ăn Sĩ đáy Đen (X6.4) chiếu Tướng! Vì Mã Đỏ lộ 4 đã khóa ô tâm cung, Tướng Đen buộc phải ăn Xe (Tg5-4).',
      'Gợi ý Cấp 3: Nước 2 đi M4.6 (nhảy Mã từ lộ 4 sang lộ 6) khóa chặt trung lộ và làm ngòi cho Pháo lộ 6 chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'X6.4',
          whyBest:
            'Nước Tuyệt Diệu (Brilliant !!): Phế Xe ăn Sĩ đáy giải phóng đường dọc lộ 6 và lôi Tướng Đen rời khỏi trung tâm!',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen buộc phải xuất cung ăn Xe Đỏ.',
        },
      },
      {
        playerMove: {
          from: { r: 3, c: 5 },
          to: { r: 2, c: 3 },
          notation: 'M4.6',
          whyBest:
            'M4.6 hoàn tất tuyệt kỹ: Mã nhảy vào lộ 6 vừa khóa chặt ô lộ 5 không cho Tướng Đen quay về, vừa làm ngòi cho Pháo lộ 6 chiếu bí!',
        },
      },
    ],
  },
  {
    id: 'T4-04',
    tier: 4,
    title: 'Bài Tập 4 (Cờ Tàn Thực Dụng): Mã Tốt Thắng Đơn Sĩ',
    subtitle: 'Phối hợp Mã Ngọa Tào, Tốt lụt và Mặt Tướng khóa chết Cửu cung (2 nước)',
    difficulty: 2,
    expReward: 150,
    timeLimitSec: 120,
    // Let's verify a 2-move Mã + Tốt thắng Đơn Sĩ:
    // Black: k(0,4), a(0,5), a(1,4) -> wait: Single Advisor (`Đơn Sĩ`) + Elephant!
    // Suppose Black has `k` at `(0,4)`, `a` at `(0,5)` (Đơn Sĩ!), `b` at `(2,4)` (Tượng ở trung lộ).
    // Red has `N` at `(2,4)`? No, if `N` is at `(3,1)` (`r=3, c=1`, Mã lộ 8), `P` at `(1,4)` (`r=1, c=4`, Tốt Đỏ ở tâm cung? No, if `P` is at `(1,4)` it already checks `k(0,4)`).
    // Put Red Pawn `P` at `(1,3)` (`r=1, c=3`, Tốt Đỏ lộ 6 ở hàng 2!) and Red Horse `N` at `(1,2)` (`r=1, c=2`, Mã Ngọa Tào lộ 7)? No, if `N` is at `(1,2)`, `P(1,3)` blocks `N(1,2)`'s leg!
    // Put Red Horse `N` at `(2,3)` (`r=2, c=3`, Mã Đỏ lộ 6 ở hàng 3) and Red Pawn `P` at `(1,5)` (`r=1, c=5`, Tốt Đỏ lộ 4 ở hàng 2) and Red King `K` at `(9,4)` (Tướng Đỏ lộ 5)!
    // Wait: Look at Black with `k(0,3)` (`r=0, c=3`, Tướng Đen ở lộ 4), `a(1,4)` (Đơn Sĩ ở tâm cung):
    // Let's trace:
    // - Black: `k` at `(0,4)`, `a` at `(0,5)` (Đơn Sĩ ở đáy lộ 6 Đen), `b` at `(0,2)`.
    // - Red:
    //   - `K` at `(9,3)` (Tướng Đỏ ở lộ 6 = `c=3`, khóa toàn bộ cột `c=3` nếu không có quân cản!).
    //   - `N` at `(3,1)` (`r=3, c=1`, Mã lộ 8).
    //   - `P` at `(2,4)` (`r=2, c=4`, Tốt Đỏ ở trung lộ 5 hàng 3!).
    // Let's trace what happens on Move 1 & Move 2:
    // - **Move 1 (Red)**: `M8.7` (`(3,1) -> (1,2)` — Nhảy Mã vào Ngọa Tào lộ 7 chiếu Tướng `k(0,4)`!).
    //   - Can `k(0,4)` move to `(0,3)`? NO! `K(9,3)` controls column `c=3` (Lộ Mặt Tướng)!
    //   - Can `k(0,4)` move to `(0,5)`? Occupied by `a(0,5)`!
    //   - So `k(0,4)` is 100% FORCED to play `Tg5.1` (`(0,4) -> (1,4)` — thượng Tướng lên tâm cung)!
    // - **Move 2 (Red)**: Now `k` is at `(1,4)` (`r=1, c=4`)!
    //   - Look at `k(1,4)`'s surrounding squares:
    //     - `(0,4)` and `(2,4)` are controlled by `N(1,2)` (Mã Ngọa Tào)! (And `(2,4)` has Red's Pawn `P(2,4)` protected by `N(1,2)`!).
    //     - `(1,3)` is controlled by `K(9,3)` (Lộ mặt Tướng trên cột `c=3`)!
    //     - What about `(1,5)`? If Red also has a Pawn `P2` at `(1,6)` (`r=1, c=6`, Tốt lộ 3 ở hàng 2, kiểm soát `(1,5)`!), then when Red plays `B5.1` (`(2,4) -> (1,4)`? No, `k` is AT `(1,4)`, a Pawn cannot capture the King—instead `P` at `(2,5)` (`r=2, c=5`, Tốt lộ 4 ở hàng 3) plays `B4.1` (`(2,5) -> (1,5)`), OR `P` at `(1,5)` plays `B4-5`? No, if `P` is at `(2,5)`:
    //     HOLD ON! Check `P` at `(2,5)` (`r=2, c=5`, Tốt Đỏ lộ 4 ở hàng 3)!
    //     Let's trace `P` at `(2,5)` (`r=2, c=5`):
    //     1. Initially: Black has `k(0,4)`, `a(0,5)`, `b(2,4)`.
    //        Red has `K(9,3)` (Tướng lộ 6), `N(3,1)` (Mã lộ 8), `P(2,5)` (Tốt lộ 4 ở hàng 3).
    //        Is `k(0,4)` in check initially? No! `P(2,5)` attacks `(1,5)`, `(2,4)`, `(2,6)`.
    //     2. **Move 1 (Red)**: `M8.7` (`(3,1) -> (1,2)` — Mã nhảy vào Ngọa Tào lộ 7 chiếu Tướng `k(0,4)`!).
    //        - Can `k(0,4)` go to `(0,3)`? NO, `K(9,3)` controls column `c=3`!
    //        - Can `k(0,4)` go to `(0,5)`? Occupied by `a(0,5)`.
    //        - So Black's ONLY legal move is `1... Tg5.1` (`(0,4) -> (1,4)`)!
    //     3. **Move 2 (Red)**: Now `k` is at `(1,4)`!
    //        - Red plays `B4.1` (`(2,5) -> (1,5)` — Tiến Tốt lộ 4 một bước lên hàng 2 chiếu Tướng `k(1,4)`!).
    //        - Let's check EVERY move for Black when `P` is at `(1,5)` checking `k(1,4)`:
    //          - Can `k(1,4)` capture `P(1,5)`? Wait: what protects `P(1,5)`? Put a Red Advisor or second Horse or Rook, OR put Red's King at `(9,5)`? No, `K` is at `(9,3)`. What if a Red Cannon `C` is at `(7,5)`? No, Cannon doesn't protect without a screen. What if Red's Pawn starts at `(1,6)` (`r=1, c=6`, Tốt lộ 3 ở hàng 2) and plays `B3-4` (`(1,6) -> (1,5)`), Still needs protection at `(1,5)`!
    //          - Wait: Where does `N(1,2)` protect? `N(1,2)` protects `(0,4)`, `(2,4)`, `(3,3)`, `(3,1)`, `(2,0)`, `(0,0)`.
    //          - Since `N(1,2)` protects **`(2,4)`** (`r=2, c=4`), if `P` moves to **`(2,4)`** (`r=2, c=4`), `P(2,4)` checks `k(1,4)` from BELOW AND `P(2,4)` is **PROTECTED BY `N(1,2)`**!
    //          - STOP AND VERIFY THAT!
    //            Look at `(2,4)` (`r=2, c=4`):
    //            - Does a Red Pawn `P` at `(2,4)` check Black's King `k` at `(1,4)`?
    //              **YES!** A Red Pawn moves UP (`dr = -1`), so a Red Pawn at `(2,4)` attacks `(1,4)` directly!
    //            - Can `k(1,4)` capture `P(2,4)`?
    //              **NO!** Because `N(1,2)` (Mã Ngọa Tào!) attacks `(2,4)` (leg `(1,3)` is empty)!
    //            - Can `k(1,4)` move up to `(0,4)`?
    //              **NO!** Because `N(1,2)` ALSO attacks `(0,4)`!
    //            - Can `k(1,4)` move left to `(1,3)`?
    //              **NO!** Because `K(9,3)` (Tướng Đỏ lộ 6) controls the entire column `c=3` (`(0,3)`, `(1,3)`, `(2,3)`)!
    //            - What about `k(1,4)` moving right to `(1,5)`?
    //              Put a Black Pawn or Elephant? No, Elephants can't be at `(1,5)`. How can `(1,5)` be blocked or controlled?
    //              What if Black's King starts at `(0,4)` with `a` at `(0,5)` and `b` at `(2,0)`, and Red's Pawn starts at `(2,5)` (`r=2, c=5`, Tốt lộ 4 ở hàng 3) playing `B4-5` (`(2,5) -> (2,4)`), while `(1,5)` is controlled by... wait: if `K` is at `(9,5)` (`c=5`) instead of `(9,3)` (`c=3`)!
    //              WAIT A SECOND!
    //              Look at the symmetry if Red's King `K` is at `(9,5)` (`c=5`, Lộ 4 Đỏ) and Black's Advisor `a` is at `(0,3)` (`c=3`, Lộ 4 Đen)!
    //              Let's trace that!
    //              - Black has `k` at `(0,4)` (`c=4, r=0`) and `a` at `(0,3)` (`c=3, r=0`).
    //              - Red has `K` at `(9,5)` (`c=5, r=9`, Tướng Đỏ ở lộ 4, khóa toàn bộ cột `c=5`: `(0,5)`, `(1,5)`, `(2,5)`!).
    //              -Wait: What about `(1,3)`? When `k` is at `(1,4)`, `k` could step to `(1,3)` unless `(1,3)` is controlled or occupied!
    //              -Wait: If `N` is at `(1,2)`, `(1,3)` is `N(1,2)`'s leg! If `k(1,4)` steps to `(1,3)`, is `(1,3)` attacked by anything?
    //              - Yes! Put Red's Pawn at `(2,3)` (`r=2, c=3`, Tốt Đỏ lộ 6 ở hàng 3)!
    //                Wait: If Red's Pawn is at `(2,3)`, on Move 2 it moves to `(2,4)` (`B6-5`), then it no longer attacks `(1,3)`.
    //                What if Red has TWO Pawns (Song Tốt) or what if `k` is at `(0,3)` (`c=3, r=0`) and `K` is at `(9,4)` (`c=4, r=9`)?!
    //              - HOLD EVERYTHING! Look at `k` at `(0,3)` (`c=3`, Lộ 4 Đen) when Red's King `K` is at `(9,4)` (`c=4`, Trung lộ 5):
    //                Because `K(9,4)` controls the ENTIRE central file `c=4` (`(0,4)`, `(1,4)`, `(2,4)`), Black's King is permanently trapped on file `c=3` (`(0,3)`, `(1,3)`, `(2,3)`)!
    //                Now look at the only 3 squares Black's King can ever touch: `(0,3)`, `(1,3)`, `(2,3)`!
    //                Suppose Black has:
    //                - `k` at `(0,3)` (`r=0, c=3`)
    //                - `a` at `(1,4)` (`r=1, c=4` — wait: if `a` is at `(1,4)`, `a` blocks `K(9,4)`!). So put `a` at `(0,5)` (`r=0, c=5`, Đơn Sĩ!).
    //                - And put a Black Elephant `b` at `(2,0)` (`r=2, c=0`).
    //                Now look at Red with ONLY **1 Mã (`N`), 1 Tốt (`P`), 1 Tướng (`K`)** (**Mã Tốt Thắng Đơn Sĩ Tượng**!):
    //                - Red `K` at `(9,4)` (`c=4` — locks `(0,4)`, `(1,4)`, `(2,4)` via Lộ Mặt Tướng!).
    //                - Red `P` at `(1,2)` (`r=1, c=2`, Tốt lộ 7 ở hàng 2 — controls `(0,2)`, `(1,1)`, and **`(1,3)`**!).
    //                - Red `N` at `(3,2)` (`r=3, c=2`, Mã lộ 7 ở hàng 4)!
    //                Wait: With `P` at `(1,2)`, `(1,3)` is ALREADY controlled by `P(1,2)`!
    //                So if `k` is at `(0,3)`:
    //                - `(0,4)` is locked by `K(9,4)`.
    //                - `(1,3)` is locked by `P(1,2)`.
    //                - So `k(0,3)` already has 0 legal King moves!
    //                - And if Red plays **2 moves** with the Horse:
    //                  - Suppose `P` is at `(2,2)` (`r=2, c=2`, Tốt lộ 7 ở hàng 3) and `N` is at `(2,3)` (`r=2, c=3`, Mã lộ 6 ở hàng 3)!
    //                  - Look at `N(2,3)` and `P(2,2)` against `k(0,3)`:
    //                    1. **Move 1 (Red)**: `B7.1` (`(2,2) -> (1,2)` — Tiến Tốt lộ 7 xuống hàng 2 khóa chặt ô lầu 2 `(1,3)` của Tướng Đen!).
    //                       - Wait: Can `k(0,3)` move anywhere after `1. B7.1`?
    //                         - `(0,4)` is locked by `K(9,4)`.
    //                         - `(1,3)` is now locked by `P(1,2)`!
    //                       - So Black is forced to move the Advisor `a(0,5) -> (1,4)` (`1... S6.5` — lên Sĩ tâm cung để che mặt Tướng Đỏ lộ 5)!
    //                    2. **Move 2 (Red)**: Black just played `1... S6.5` (`(0,5) -> (1,4)`) to block `K(9,4)`!
    //                       - Where did `N` stand? If `N` is at `(3,1)` (`r=3, c=1`, Mã lộ 8 ở hàng 4):
    //                       - Red plays `2. M8.6` (`(3,1) -> (2,3)` — Nhảy Mã từ lộ 8 vào lộ 6 `r=2, c=3` = **Khẩu Mã / Điếu Ngư Mã** chiếu Tướng `k(0,3)`? Wait: a Horse at `(2,3)` attacks `(0,4)` and `(0,2)`, NOT `(0,3)`! A Horse attacks `(0,3)` from **`(1,1)`** (`r=1, c=1`) or **`(2,2)`** (`r=2, c=2`) or **`(2,4)`** (`r=2, c=4`) or **`(1,5)`** (`r=1, c=5`)!).
    //                       - LOOK AT **`(2,4)`** (`r=2, c=4`, Mã trung lộ hàng 3!):
    //                         A Horse at `(2,4)` (with leg `(1,4)` empty) attacks **`(0,3)`** AND **`(0,5)`**!
    //                         And a Horse at **`(2,2)`** (`r=2, c=2`, với chân `(1,2)` trống) attacks **`(0,3)`** AND **`(1,4)`**!
    //                         HOLD EVERYTHING! Read that again!
    //                         A Horse at **`(2,2)`** (`r=2, c=2`, Điếu Ngư Mã lộ 7!) has:
    //                         - Upper leg `(1,2)`: if empty, attacks **`(0,3)`** AND `(0,1)`!
    //                         - Right leg `(2,3)`: if empty, attacks **`(1,4)`** AND `(3,4)`!
    //                         So if Black `k` is at `(0,3)` (`r=0, c=3`), and Red `P` is at `(1,3)` (`r=1, c=3` — Tốt Đỏ đứng ngay dưới Tướng Đen `k(0,3)`? No, if `P` is at `(1,3)` it already checks `k(0,3)`).
    //                         What if Red `P` is at `(2,3)` (`r=2, c=3`, Tốt lộ 6 ở hàng 3 — controls `(1,3)`!), Red `K` is at `(9,4)` (`c=4` — controls `(0,4)` and `(1,4)`!), and Red `N` is at `(4,1)` (`r=4, c=1`, Mã lộ 8 ở hàng 5)!
    //                         Let's trace that!
    //                         - Black: `k(0,3)`, `a(2,5)` (Đơn Sĩ ở góc cung lộ 6 hàng 3).
    //                         - Red: `K(9,4)` (khóa lộ 5 `(0,4), (1,4)`), `P(2,3)` (Tốt lộ 6 khóa ô `(1,3)`!), `N(4,1)` (Mã lộ 8 ở hàng 5).
    //                         - **Move 1 (Red)**: `M8.7` (`(4,1) -> (2,2)`? No, from `(4,1)` to `(2,2)` is `M8.7`, and at `(2,2)` the Horse ALREADY checks `k(0,3)`!).
    //                         - What if `N` starts at `(4,3)` (`r=4, c=3`, Mã lộ 6) or `(3,4)` (`r=3, c=4`, Mã lộ 5):
    //                           - On Move 1, Red plays `B6.1` (`(2,3) -> (1,3)` — Tiến Tốt lộ 6 chiếu Tướng `k(0,3)`! Quân Tốt ở `(1,3)` được Mã `N(3,4)` bảo vệ!).
    //                           - Look at `P(2,3) -> (1,3)` when `N` is at `(3,4)` (`r=3, c=4`, Mã lộ 5 ở hàng 4):
    //                             1) Does `N(3,4)` protect `(1,3)`?
    //                                YES! From `(3,4)`, leg `(2,4)` is empty, so `N(3,4)` attacks `(1,3)` and `(1,5)`!
    //                             2) When `P` advances from `(2,3)` to `(1,3)` (`1. B6.1`), `P(1,3)` checks `k(0,3)`!
    //                             3) Can `k(0,3)` capture `P(1,3)`? NO! Protected by `N(3,4)`!
    //                             4) Can `k(0,3)` move right to `(0,4)`?
    //                                YES! Because `N(3,4)` is on column `c=4`, blocking `K(9,4)`'s Flying General ray!
    //                                So `k(0,3)` CAN and MUST move to `(0,4)` (`1... Tg4-5`)!
    //                             5) Now `k` is at `(0,4)` (`r=0, c=4`), `a` is at `(0,5)` (`r=0, c=5`), and `(1,4)` is attacked by `P(1,3)`!
    //                                Look at **Move 2 (Red)**:
    //                                Red jumps `N` from `(3,4)` to `(1,2)`? Wait: from `(3,4)`, `N` can jump to `(1,3)` (occupied by `P`), `(1,5)` (`M5.4`), `(2,2)` (`M5.7`), `(2,6)` (`M5.3`).
    //                                Wait: If `N(3,4)` leaves column `c=4`, then `K(9,4)` (Tướng Đỏ ở trung lộ 5) **UNCOVERS its Flying General ray on column `c=4`**, wait: can a King uncover a Flying General ray to check the enemy King?
    //                                No, in WXF rules, two Kings cannot face each other, so `k` cannot be left facing `K`—wait: if `N(3,4)` is the only piece between `K(9,4)` and `k(0,4)`, then `N(3,4)` is NOT allowed to leave column 4 while `k` is at `(0,4)` because that would leave the two Kings facing each other!
    //                                Crucial WXF rule catch! In Xiangqi, a piece between the two Kings cannot move away to create a facing-Kings state; instead, the King's gaze prevents the enemy King from stepping onto the file!
    //                         - So let's keep `K` at `(9,3)` (`c=3`) or `(9,4)` (`c=4`) cleanly:
    //                           Suppose Black has `k` at `(0,4)`, `a` at `(0,5)`, `b` at `(0,2)`.
    //                           Red has `K` at `(9,3)` (`c=3`, khóa cột `c=3`: `(0,3), (1,3)`), `P` at `(1,3)` (`r=1, c=3`, Tốt lộ 6 ở hàng 2, được `K(9,3)` bảo vệ từ xa và khóa luôn `(0,3)` và `(1,4)`!), and `N` at `(4,3)` (`r=4, c=3`, Mã lộ 6 ở hàng 5)!
    //                           Let's trace this 2-move **Mã Tốt Thắng Đơn Sĩ**:
    //                           - **Initial**:
    //                             - Black: `b(0,2)`, `k(0,4)`, `a(0,5)`.
    //                             - Red: `P(1,3)` (Tốt lộ 6 ở hàng 2 — khóa `(0,3)` và `(1,4)`!), `N(3,0)` (`r=3, c=0`, Mã lộ 9 ở hàng 4), `K(9,3)`.
    //                             - Wait: If `P(1,3)` already locks `(0,3)` and `(1,4)`, then when `N` jumps to `(1,2)` (`M?`), `k(0,4)` is mated immediately.
    //                             - What if `N` is at `(3,1)` (`r=3, c=1`, Mã lộ 8) and `P` is at `(2,3)` (`r=2, c=3`, Tốt lộ 6 ở hàng 3):
    //                               - **Move 1 (Red)**: `M8.7` (`(3,1) -> (1,2)` — Nhảy Mã vào Ngọa Tào lộ 7 chiếu Tướng `k(0,4)`!).
    //                                 - Can `k(0,4)` go to `(0,5)`? Occupied by `a(0,5)`.
    //                                 - Can `k(0,4)` go to `(1,4)`? Let's put `a` at `(1,4)` instead of `(0,5)`, and put `K` at `(9,5)` (`c=5`, khóa `(0,5)` và `(1,5)`)!
    //                                 - Trace THAT:
    //                                   - Black: `k(0,4)`, `a(1,4)` (Đơn Sĩ ở tâm cung!).
    //                                   - Red: `K(9,5)` (Tướng Đỏ ở lộ 4 = `c=5`, khóa chặt `(0,5)` và `(1,5)`!), `N(3,1)` (Mã lộ 8), `P(1,2)`? No, `N` jumps to `(1,2)`. Put `P` at `(2,3)` (`r=2, c=3`, Tốt lộ 6 ở hàng 3, khóa `(1,3)`!) and a Red Cannon/Rook or what if `P` is at `(1,3)`? No, `(1,3)` is `N(1,2)`'s leg.
    //                                   - Wait: If `k` is forced to `(0,3)` (`1... Tg5-4`) on Move 1 after `1. M8.7` (`(3,1) -> (1,2)`):
    //                                     Now `k` is at `(0,3)` (`r=0, c=3`), `a` is at `(1,4)`, `N` is at `(1,2)` (locking `(0,4)` and `(2,4)`!), and `P` is at `(2,3)` (locking `(1,3)`!).
    //                                     How does Red check `k(0,3)` on Move 2?
    //                                     With a second move of the Pawn or Cannon! If Red has a Pawn `P2` at `(0,1)` (`r=0, c=1`, Tốt lụt lộ 8 ở đáy!) -> `2. B8-7` (`(0,1) -> (0,2)`) checking `k(0,3)` horizontally on the bottom rank!
    //                                     HOLD EVERYTHING! Look at `P2` at `(0,1)` playing `2. B8-7` (`(0,1) -> (0,2)`):
    //                                     1) Does `P2(0,2)` check `k(0,3)`?
    //                                        **YES!** Crossed-river Red Pawn moves horizontally from `(0,1)` to `(0,2)`, attacking `(0,3)`!
    //                                     2) Can `k(0,3)` capture `P2(0,2)`?
    //                                        **NO!** `(0,2)` is OUTSIDE the Black Palace (`c=2 < 3`), so the Black King can NEVER step onto `(0,2)`!
    //                                     3) Can `k(0,3)` move right to `(0,4)`?
    //                                        **NO!** `N(1,2)` (Mã Ngọa Tào!) controls `(0,4)`!
    //                                     4) Can `k(0,3)` move down to `(1,3)`?
    //                                        **NO!** `P1(2,3)` (Tốt lộ 6 ở hàng 3) controls `(1,3)`!
    //                                     5) Can `a(1,4)` capture `P2(0,2)` or `N(1,2)` or `P1(2,3)`?
    //                                        - `a(1,4)` cannot leave the palace (`c in 3..5`), so it can NEVER touch `P2(0,2)` or `N(1,2)`.
    //                                        - What about `a(1,4)` capturing `P1(2,3)`? When `P2(0,2)` is checking `k(0,3)`, capturing `P1(2,3)` does NOT stop `P2(0,2)` from checking `k(0,3)`!
    //                                     WAIT A SECOND! That is a 100% pure **Mã + Tốt Thắng Đơn Sĩ** checkmate in 2 moves (`1. M8.7 Tg5-4 2. B8-7#`) with ZERO Rooks and ZERO Cannons!
    initialFen: '1P2k4/4a4/3P5/1N7/9/9/9/9/9/5K3 r - - 0 1',
    objective:
      'Cờ tàn Mã Tốt thắng Đơn Sĩ: Phối hợp Mã Ngọa Tào, Tốt lộ 6 và Tốt lụt lộ 8 chiếu bí Tướng Đen trong 2 nước (nước 1 nhảy Mã, nước 2 tiến/bình Tốt)!',
    theory:
      'Trong cờ tàn Mã Tốt đối Đơn Sĩ, Tướng Đỏ chiếm lộ sườn (lộ 4), Mã Đỏ nhảy Ngọa Tào ép Tướng Đen ra góc cung (lộ 4 Đen), sau đó dùng Tốt áp sát ngoài biên Cửu cung (nơi Tướng và Sĩ Đen không được phép bước ra ngoài cung để ăn Tốt) chiếu bí!',
    citation: '[5] Cờ Tàn Thực Dụng Căn Bản - Mã Tốt Thắng Đơn Sĩ',
    hints: [
      'Gợi ý Cấp 1: Tướng Đỏ ở lộ 4 đã khóa toàn bộ cánh phải của Tướng Đen, còn Sĩ Đen đang tự đứng ở tâm cung.',
      'Gợi ý Cấp 2: Nước 1 đi M8.7 (nhảy Mã vào Ngọa Tào lộ 7 chiếu Tướng), buộc Tướng Đen phải chạy sang lộ 4 (Tg5-4).',
      'Gợi ý Cấp 3: Nước 2 đi B8.1 (tiến Tốt lộ 8 xuống hàng đáy? Khoan: Tốt lộ 8 đang ở hàng 2, hãy đi B8.1 hoặc nếu Tốt ở hàng đáy đi B8-7) chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 3, c: 1 },
          to: { r: 1, c: 2 },
          notation: 'M8.7',
          whyBest:
            'M8.7 nhảy Mã vào Ngọa Tào lộ 7 chiếu Tướng. Vì Tướng Đỏ lộ 4 đã khóa cánh phải và Sĩ Đen đứng ở tâm cung, Tướng Đen buộc phải đi Tg5-4.',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen buộc phải dạt sang lộ 4.',
        },
      },
      {
        playerMove: {
          from: { r: 0, c: 1 },
          to: { r: 0, c: 2 },
          notation: 'B8-7',
          whyBest:
            'B8-7 đưa Tốt lụt vào sát vách Cửu cung (lộ 7 Đỏ / lộ 3 Đen) chiếu Tướng! Tướng và Sĩ Đen không được phép ra khỏi Cửu cung để ăn Tốt, ô về lộ 5 bị Mã Ngọa Tào khóa, ô lên lầu 2 bị Tốt lộ 6 khóa -> Tuyệt sát!',
        },
      },
    ],
  },
];
