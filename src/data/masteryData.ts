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
  isMatePuzzle?: boolean;
  timeLimitSec?: number; // Countdown timer for Tier 4
  hints: [string, string, string]; // 3-level Hint system
  steps: LessonStep[];
}

export const TIER_METADATA = [
  {
    tier: 1 as const,
    name: 'Tầng 1: Nhập Môn & Cảm Giác Quân',
    period: 'Tuần 1 – 2',
    goal: 'Nắm vững luật đặc thù (Cản Mã, Mắt Tượng, Lộ Mặt Tướng), Giá trị quân cờ & 8 bài tập Sát cục 1 nước.',
  },
  {
    tier: 2 as const,
    name: 'Tầng 2: 10 Sát Pháp Cơ Bản',
    period: 'Tuần 3 – 6',
    goal: 'Thành thạo 8 đòn sát pháp phối hợp 2-3 nước (Mã Hậu Pháo, Thiết Môn Thuyên, Pháo Trùng, Điếu Ngư Mã...).',
  },
  {
    tier: 3 as const,
    name: 'Tầng 3: Khai Cuộc Tinh Hoa & Cờ Tàn',
    period: 'Tháng 2 – 3',
    goal: 'Thực hành 5 thế trận khai cuộc kinh điển có mũi tên gợi ý và cờ tàn thực dụng Mã Tốt thắng Đơn Sĩ.',
  },
  {
    tier: 4 as const,
    name: 'Tầng 4: Cờ Thế Giang Hồ & Danh Cục Cổ',
    period: 'Tháng 4+',
    goal: 'Giải Tứ Đại Danh Cục giang hồ trắc tuyệt (Thất Tinh Tụ Hội, Dã Mã Thao Điền, Đơn Đao Phó Hội, Thiên Lý Độc Hành).',
  },
];

export const MASTERY_LESSONS: MasteryLesson[] = [
  // ============================================================================
  // TẦNG 1: SÁT CỤC 1 NƯỚC NÂNG CAO (8 BÀI TẬP TƯƠNG TÁC + LUẬT ĐẶC THÙ)
  // ============================================================================
  {
    id: 'T1-01',
    tier: 1,
    title: 'Bài 1.1: Cản Chân Mã (Biệt Mã Cước) & Ngọa Tào 1 Nước',
    subtitle: 'Nhận diện chân Mã bị cản và hướng nhảy hợp lệ',
    difficulty: 1,
    expReward: 50,
    initialFen: '3ak4/4a4/3pN4/9/9/5R3/9/9/9/4K4 r - - 0 1',
    isMatePuzzle: true,
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
            'Chân Mã bên trái bị Tốt Đen cản (Biệt Mã Cước), nên M5.3 nhảy về cánh phải vào đúng vị trí Ngọa Tào là nước duy nhất hợp lệ và chiếu bí ngay khi Xe lộ 4 đã khóa sườn.',
        },
      },
    ],
  },
  {
    id: 'T1-02',
    tier: 1,
    title: 'Bài 1.2: Chặn Mắt Tượng (Điền Tượng Nhãn) & Mở Đường Pháo Đầu',
    subtitle: 'Hiểu quy tắc tâm chữ Điền của Tượng và đòn mở mặt Pháo',
    difficulty: 1,
    expReward: 50,
    initialFen: '4k4/4a4/9/9/9/5R3/5P3/4B4/4C4/3KC4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Nhấp vào Tượng Đỏ trung lộ để thấy mắt Tượng bị Tốt Đỏ tại (6,5) chặn bên phải, sau đó gác Tượng sang lộ 7 mở toang lộ 5 cho Pháo đầu chiếu bí.',
    theory:
      'Quân Tượng đi chéo 2 ô (hình chữ Điền) và không được qua sông. Nếu tại giao điểm tâm hình chữ Điền có quân đứng thì bị "Chặn mắt Tượng" (Điền Tượng Nhãn).',
    citation: '[1] World Xiangqi Federation (WXF) - Rule 4.3 (The Elephant)',
    hints: [
      'Gợi ý Cấp 1: Nhấp vào Tượng Đỏ lộ 5 để xem hướng chéo nào đang bị Tốt Đỏ cản mắt.',
      'Gợi ý Cấp 2: Mắt Tượng bên phải bị chặn, nhưng mắt Tượng bên trái hoàn toàn thông thoáng.',
      'Gợi ý Cấp 3: Đi nước T5.7 (rút Tượng về lộ 7) để mở lộ 5 cho Pháo đầu mượn Sĩ Đen chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 4 },
          to: { r: 5, c: 2 },
          notation: 'T5.7',
          whyBest:
            'Nước T5.7 rút Tượng khỏi trung lộ kích hoạt Pháo 5 bắn qua Sĩ Đen chiếu bí khi Tướng Đen bị kẹt giữa Xe 4 và Tướng Đỏ 6.',
        },
      },
    ],
  },
  {
    id: 'T1-03',
    tier: 1,
    title: 'Bài 1.3: Luật Lộ Mặt Tướng (Phi Tướng Trợ Công) & Đơn Xe Chiếu Bí',
    subtitle: 'Ứng dụng uy lực kiểm soát toàn bộ trục dọc của Tướng',
    difficulty: 1,
    expReward: 60,
    initialFen: '3k5/2P6/8R/9/9/9/9/9/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Sử dụng Mặt Tướng Đỏ lộ 5 khóa trung lộ và Tốt lộ 7 khống chế lầu 2, đâm Xe lộ 1 xuống hàng đáy chiếu bí trong 1 nước.',
    theory:
      'Hai Tướng không được nhìn thẳng mặt nhau trên cùng một cột dọc mà không có quân cản (Luật Lộ Mặt Tướng / Chống Tướng). Tướng phe chủ động có thể đóng vai trò như một cỗ xe khống chế toàn bộ cột dọc.',
    citation: '[1] World Xiangqi Federation (WXF) - Rule 4.1 (The General / Flying General)',
    hints: [
      'Gợi ý Cấp 1: Tướng Đen không thể di chuyển sang lộ 5 vì sẽ phạm luật Lộ Mặt Tướng với Tướng Đỏ.',
      'Gợi ý Cấp 2: Tốt Đỏ ở lộ 7 đang khống chế ô lầu 2 (r:1, c:3) của Đen.',
      'Gợi ý Cấp 3: Đi nước X1.2 đâm Xe xuống hàng đáy lộ 1 chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 8 },
          to: { r: 0, c: 8 },
          notation: 'X1.2',
          whyBest:
            'X1.2 đâm Xe xuống hàng đáy chiếu bí; Tướng Đen không thể sang lộ 5 vì phạm luật Lộ Mặt Tướng với Tướng Đỏ.',
        },
      },
    ],
  },
  {
    id: 'T1-04',
    tier: 1,
    title: 'Bài 1.4: Phối Hợp Song Xe Đâm Đáy (Bạt Sơn Cái Thế)',
    subtitle: 'Kỹ thuật khóa hàng 2 và đâm đáy dứt điểm',
    difficulty: 1,
    expReward: 60,
    initialFen: '3k1a3/1R7/3a5/9/9/R8/9/9/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Xe 8 đã khóa hàng 2 và Tướng Đỏ kiểm soát trung lộ 5. Hãy đâm tiếp Xe lộ 9 xuống hàng đáy chiếu bí.',
    theory:
      'Trong cờ tướng, "Song Xa vạn năng". Khi một Xe chiếm giữ hàng 2 (áp đỉnh) và Xe kia đâm xuống hàng đáy (đáy cung), tạo thành sát thế không thể cản phá.',
    citation: '[3] Quất Trung Bí (1632) - Sát Cục Căn Bản',
    hints: [
      'Gợi ý Cấp 1: Xe Đỏ lộ 8 tại hàng 1 đang khóa chặt không cho Tướng Đen trồi lên lầu 2.',
      'Gợi ý Cấp 2: Hãy tìm quân Xe còn lại ở cánh trái để tấn công trực diện.',
      'Gợi ý Cấp 3: Đi nước X9.5 đâm thẳng Xe lộ 9 xuống hàng đáy chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 5, c: 0 },
          to: { r: 0, c: 0 },
          notation: 'X9.5',
          whyBest:
            'X9.5 chiếm lĩnh hàng đáy, Xe 8 khóa lầu 2 và Mặt Tướng Đỏ khóa trung lộ khiến Tướng Đen tuyệt sát.',
        },
      },
    ],
  },
  {
    id: 'T1-05',
    tier: 1,
    title: 'Bài 1.5: Tốt Nhập Cung Phối Hợp Pháo Tướng',
    subtitle: 'Uy lực của Tốt lụt khi lọt vào hiểm địa Cửu cung',
    difficulty: 1,
    expReward: 70,
    initialFen: '3k1a3/4a4/3P5/9/9/4C4/9/9/9/3K5 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Thúc Tốt lộ 6 tiến 1 vào cung Đen chiếu bí dưới sự bảo bọc của Mặt Tướng Đỏ và Pháo trung tâm.',
    theory:
      'Tốt qua sông có giá trị tương đương nửa quân Xe. Khi Tốt áp sát hoặc tiến vào trung tâm Cửu cung, dưới sự che chắn của Tướng hoặc Pháo, Tốt có thể kết liễu trận đấu chỉ trong 1 nước.',
    citation: '[2] Cờ Tàn Nghệ Thuật - Binh Nhập Cửu Cung',
    hints: [
      'Gợi ý Cấp 1: Tướng Đỏ ở lộ 6 và Pháo Đỏ ở lộ 5 đang kiểm soát toàn bộ đường rút lui của Đen.',
      'Gợi ý Cấp 2: Tốt Đỏ tại (2,3) chỉ cần tiến thêm 1 bước nữa.',
      'Gợi ý Cấp 3: Đi nước B6.1 (thúc Tốt lộ 6 tiến 1) chiếu bí ngay!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 3 },
          to: { r: 1, c: 3 },
          notation: 'B6.1',
          whyBest:
            'B6.1 tiến Tốt chiếu Tướng; Tướng Đen không thể ăn Tốt (Lộ mặt tướng với Tướng Đỏ lộ 6), không thể sang lộ 5 (Pháo 5 kiểm soát qua Sĩ) -> Tuyệt sát!',
        },
      },
    ],
  },
  {
    id: 'T1-06',
    tier: 1,
    title: 'Bài 1.6: Mã Hậu Pháo 1 Nước (Chuẩn Quất Trung Bí)',
    subtitle: 'Thế cờ sát pháp kinh điển nhất trong cờ tướng',
    difficulty: 1,
    expReward: 70,
    initialFen: '2bk1ab2/9/3N1a3/9/9/9/9/5C3/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Bình Pháo lộ 4 sang lộ 6 mượn Mã lộ 6 làm ngòi chiếu bí trong 1 nước.',
    theory:
      'Mã Hậu Pháo là sát pháp kết hợp giữa Mã và Pháo: Mã đứng trước vừa khống chế các ô thoát của Tướng địch, vừa làm ngòi cho Pháo phía sau chiếu.',
    citation: '[3] Quất Trung Bí (Chu Tấn Trinh, 1632) - Sát pháp Mã Hậu Pháo',
    hints: [
      'Gợi ý Cấp 1: Mã Đỏ lộ 6 tại hàng 2 đang khống chế ô lộ 5 của Tướng Đen.',
      'Gợi ý Cấp 2: Pháo Đỏ ở hàng 7 có thể bình sang cùng cột dọc với Mã.',
      'Gợi ý Cấp 3: Đi nước P4-6 (bình Pháo lộ 4 sang lộ 6) để chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 5 },
          to: { r: 7, c: 3 },
          notation: 'P4-6',
          whyBest:
            'P4-6 tạo hình Mã Hậu Pháo: Mã lộ 6 vừa khóa ô thoát sang lộ 5 của Tướng Đen, vừa làm ngòi cho Pháo lộ 6 chiếu bí.',
        },
      },
    ],
  },
  {
    id: 'T1-07',
    tier: 1,
    title: 'Bài 1.7: Thiết Môn Thuyên 1 Nước (Chốt Cài Cửa Sắt)',
    subtitle: 'Pháo đầu ghim Sĩ và Xe đâm đáy khóa chết Tướng',
    difficulty: 1,
    expReward: 70,
    initialFen: '2b1ka3/4a4/2N6/9/4P4/3R5/9/4C4/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Pháo đầu đã ghim cứng Sĩ tâm cung Đen. Hãy đâm Xe lộ 6 xuống đáy để cài chốt cửa sắt chiếu bí.',
    theory:
      'Thiết Môn Thuyên (cài chốt cửa sắt): Pháo chiếm trung lộ khóa chặt Sĩ Tượng đối phương, Xe đâm xuống đáy chiếu bí. Tướng đối phương không thể ăn Xe vì có quân bảo vệ và Sĩ bị ghim không thể chống đỡ.',
    citation: '[3] Quất Trung Bí - Thiết Môn Thuyên Sát Cục',
    hints: [
      'Gợi ý Cấp 1: Sĩ Đen ở lộ 5 không thể di chuyển vì bị Pháo đầu Đỏ ghim.',
      'Gợi ý Cấp 2: Xe Đỏ ở lộ 6 có Mã lộ 7 yểm trợ khi đâm xuống đáy.',
      'Gợi ý Cấp 3: Đi nước X6.5 đâm Xe xuống tận đáy lộ 6 chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 5, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'X6.5',
          whyBest:
            'X6.5 đâm xuống đáy chiếu Tướng; Tướng Đen không thể ăn Xe vì Mã 7 bảo vệ, Sĩ tâm cung không thể ăn Xe vì bị Pháo đầu ghim cứng.',
        },
      },
    ],
  },
  {
    id: 'T1-08',
    tier: 1,
    title: 'Bài 1.8: Giáp Xe Pháo 1 Nước (Xe Pháo Tuyến Đáy)',
    subtitle: 'Đòn đánh hiểm hóc nơi góc cung đối phương',
    difficulty: 1,
    expReward: 70,
    initialFen: 'C3ka3/4a4/9/9/9/2R6/9/9/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Đâm Xe lộ 7 xuống đáy làm ngòi cho Pháo góc lộ 9 chiếu Tướng đồng thời khóa ô thoát sườn.',
    theory:
      'Giáp Xe Pháo: Xe và Pháo áp sát góc Cửu cung, Xe vừa làm ngòi cho Pháo chiếu, vừa khống chế đường thoát hiểm của Tướng.',
    citation: '[3] Quất Trung Bí - Giáp Xe Pháo',
    hints: [
      'Gợi ý Cấp 1: Pháo Đỏ góc lộ 9 đang chĩa súng xuống hàng đáy của Đen.',
      'Gợi ý Cấp 2: Đưa Xe Đỏ lộ 7 xuống chen vào giữa để làm ngòi và chẹt cổ Tướng Đen.',
      'Gợi ý Cấp 3: Đi nước X7.5 đâm Xe xuống đáy chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 5, c: 2 },
          to: { r: 0, c: 2 },
          notation: 'X7.5',
          whyBest:
            'X7.5 đưa Xe xuống đáy làm ngòi cho Pháo 9 chiếu Tướng, đồng thời Xe chặn ô đáy lộ 4 Đen không cho Tướng thoát.',
        },
      },
    ],
  },

  // ============================================================================
  // TẦNG 2: SÁT PHÁP KINH ĐIỂN 2-3 NƯỚC (8 THẾ CỜ PHỐI HỢP CHIẾN THUẬT)
  // ============================================================================
  {
    id: 'T2-01',
    tier: 2,
    title: 'Bài 2.1: Phế Quân Tranh Tiên (Mã Hậu Pháo 2 Nước)',
    subtitle: 'Phế Xe chém Sĩ lôi Tướng ra sườn rồi kết liễu',
    difficulty: 2,
    expReward: 110,
    initialFen: '2baka3/9/9/5N3/3Rp4/9/9/3C5/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Phế Xe chém Sĩ đáy lôi Tướng Đen ra sườn lộ 4, sau đó nhảy Mã vào lộ 6 lập hình Mã Hậu Pháo tuyệt sát.',
    theory:
      'Đòn "Phế quân tranh tiên" trong cờ tướng: Dám hy sinh quân lớn (Xe) để phá vỡ cấu trúc phòng ngự kiên cố, mở toang tuyến tấn công quyết định.',
    citation: '[3] Quất Trung Bí - Khí Tử Tranh Tiên',
    hints: [
      'Gợi ý Cấp 1: Sĩ đáy của Đen là chốt chặn bảo vệ Tướng. Đừng ngần ngại phế Xe ăn Sĩ!',
      'Gợi ý Cấp 2: Sau khi Tướng Đen ăn Xe ra lộ 4, hãy quan sát vị trí của Pháo lộ 6 và Mã lộ 4.',
      'Gợi ý Cấp 3: Nước 1 đi X6.4, sau đó nước 2 đi M4.6 tạo thế Mã Hậu Pháo tuyệt sát!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'X6.4',
          whyBest:
            'Chém Sĩ đáy chiếu Tướng, ép Tướng Đen phải ăn ra vì Mã 4 đã khóa tâm cung.',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen buộc phải ăn Xe ra lộ 4.',
        },
      },
      {
        playerMove: {
          from: { r: 3, c: 5 },
          to: { r: 2, c: 3 },
          notation: 'M4.6',
          whyBest:
            'Nhảy Mã lộ 6 vừa khóa chặt không cho Tướng Đen về lại lộ 5, vừa làm ngòi cho Pháo lộ 6 chiếu bí (Mã Hậu Pháo).',
        },
      },
    ],
  },
  {
    id: 'T2-02',
    tier: 2,
    title: 'Bài 2.2: Song Xa Thác Tiến 2 Nước (Luân Triệt Xa)',
    subtitle: 'Đòn song Xe luân phiên dồn ép Tướng tụt đáy rồi kết liễu',
    difficulty: 2,
    expReward: 110,
    initialFen: '9/3ka4/3a5/9/1R2p4/R8/9/9/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Tiến Xe 8 lên hàng 2 ép Tướng Đen tụt về đáy, sau đó phóng Xe 9 xuống hàng đáy chiếu bí.',
    theory:
      'Song Xa Thác Tiến (hoặc Luân Triệt Xa): Hai Xe phối hợp nhịp nhàng, một Xe chiếu dồn ép Tướng đối phương vào thế kẹt, Xe thứ hai tiến tới kết liễu.',
    citation: '[3] Quất Trung Bí - Song Xa Thác Tiến',
    hints: [
      'Gợi ý Cấp 1: Xe lộ 8 cần tiến lên chiếu Tướng ở hàng 2 để ép Tướng Đen lùi bước.',
      'Gợi ý Cấp 2: Khi Tướng Đen đã tụt xuống hàng đáy, Xe lộ 9 ở biên sẽ ra đòn quyết định.',
      'Gợi ý Cấp 3: Nước 1 đi X8.3, Đen đi Tg4/1, nước 2 đi X9.5 chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 1 },
          to: { r: 1, c: 1 },
          notation: 'X8.3',
          whyBest:
            'Chiếu Tướng hàng 2, ép Tướng Đen phải thoái về đáy.',
        },
        opponentReply: {
          from: { r: 1, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'Tg4/1',
          note: 'Tướng Đen thoái về đáy.',
        },
      },
      {
        playerMove: {
          from: { r: 5, c: 0 },
          to: { r: 0, c: 0 },
          notation: 'X9.5',
          whyBest:
            'Xe 8 khóa hàng 2, Xe 9 khóa hàng đáy, Tướng Đỏ khóa lộ 5 -> Tuyệt sát.',
        },
      },
    ],
  },
  {
    id: 'T2-03',
    tier: 2,
    title: 'Bài 2.3: Mã Ngọa Tào Lưỡng Chiếu 2 Nước (Thiết Môn Phá Thành)',
    subtitle: 'Đòn Lưỡng chiếu buộc Tướng xuất cung rồi đâm Xe kết liễu',
    difficulty: 2,
    expReward: 120,
    initialFen: '2b1kab2/4n1C2/4N4/3c5/9/5R3/9/4C4/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Nhảy Mã Ngọa Tào lộ 7 tạo đòn Lưỡng chiếu (Mã + Pháo đầu), ép Tướng Đen xuất cung rồi đâm Xe lộ 4 xuống đáy chiếu bí.',
    theory:
      'Đòn Lưỡng Chiếu (Double Check) là đòn chiến thuật nguy hiểm nhất: Hai quân cùng chiếu một lúc, đối phương không thể ăn quân hay chặn đường mà BẮT BUỘC phải chạy Tướng.',
    citation: '[3] Quất Trung Bí & WXF Tactics Database',
    hints: [
      'Gợi ý Cấp 1: Nhảy Mã lộ 5 sang lộ 7 vừa mở mặt Pháo đầu, vừa chiếu bằng Mã (Lưỡng chiếu).',
      'Gợi ý Cấp 2: Tướng Đen chỉ có một nước duy nhất là chạy sang lộ 4.',
      'Gợi ý Cấp 3: Nước 1 đi M5.7, nước 2 đi X4.5 đâm xuống tận đáy chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 4 },
          to: { r: 1, c: 2 },
          notation: 'M5.7',
          whyBest:
            'Lưỡng chiếu (Mã 7 + Pháo 5) buộc Tướng Đen phải dạt sang lộ 4.',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen bắt buộc phải chạy sang lộ 4.',
        },
      },
      {
        playerMove: {
          from: { r: 5, c: 5 },
          to: { r: 0, c: 5 },
          notation: 'X4.5',
          whyBest:
            'Đâm Xe lộ 4 xuống tận đáy; Mã Ngọa Tào khóa lộ 5 và khóa luôn ô lầu 2 -> Tuyệt sát.',
        },
      },
    ],
  },
  {
    id: 'T2-04',
    tier: 2,
    title: 'Bài 2.4: Điếu Ngư Mã (Mã Câu Cá Khóa Cung Phối Hợp Xe)',
    subtitle: 'Đòn khóa góc hiểm ác của Mã Câu Cá tại lộ 7',
    difficulty: 2,
    expReward: 100,
    initialFen: '2b1ka3/9/2N6/9/3Rp4/9/9/9/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Khai thác thế Mã Câu Cá ở lộ 7 (hàng 3) khóa cả ô đáy lẫn ô tâm cung, đâm Xe lộ 6 chiếu bí.',
    theory:
      'Điếu Ngư Mã (Mã Câu Cá): Mã đứng ở vị trí hàng 3 hoặc hàng 8 (lộ 3 hoặc lộ 7), khống chế cả ô (0,4) và ô (1,3). Khi Xe hoặc Pháo chiếu, Tướng đối phương không thể nhúc nhích.',
    citation: '[3] Quất Trung Bí - Điếu Ngư Mã Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Mã Đỏ ở lộ 7 đang bảo vệ điểm đáy lộ 6.',
      'Gợi ý Cấp 2: Tướng Đen không thể trồi lên tâm cung vì Mã đang ngậm miệng giếng.',
      'Gợi ý Cấp 3: Đi nước X6.4 đâm Xe xuống đáy chiếu bí ngay!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'X6.4',
          whyBest:
            'Mã lộ 7 vừa bảo vệ Xe ở đáy không cho Tướng Đen ăn, vừa khóa ô tâm cung không cho Tướng Đen trồi lên.',
        },
      },
    ],
  },
  {
    id: 'T2-05',
    tier: 2,
    title: 'Bài 2.5: Thiên Địa Pháo (Lưới Chữ Thập Khóa Cửu Cung)',
    subtitle: 'Pháo đầu ghim trung lộ và Pháo đáy bắn sườn tuyệt sát',
    difficulty: 2,
    expReward: 100,
    initialFen: '2P1ka3/4a4/9/4P4/C8/9/9/4C4/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Một Pháo ghim trung lộ, một Pháo trầm đáy mượn Tốt lụt làm ngòi tạo lưới chữ Thập tuyệt sát.',
    theory:
      'Thiên Địa Pháo: Một Pháo ở trung lộ (Thiên Pháo) phong tỏa tâm cung, một Pháo ở đáy (Địa Pháo) bắn ngang hoặc dọc kết liễu trận đấu.',
    citation: '[3] Quất Trung Bí - Thiên Địa Pháo',
    hints: [
      'Gợi ý Cấp 1: Pháo Đỏ lộ 5 đang ghim cứng Sĩ Đen ở trung lộ.',
      'Gợi ý Cấp 2: Pháo Đỏ lộ 9 ở hàng 4 có thể đâm thẳng xuống đáy qua Tốt lộ 7.',
      'Gợi ý Cấp 3: Đi nước P9.4 trầm Pháo đáy chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 0 },
          to: { r: 0, c: 0 },
          notation: 'P9.4',
          whyBest:
            'P9.4 trầm Pháo đáy chiếu qua Tốt 7; Sĩ tâm cung bị Pháo đầu ghim cứng không thể che chắn, ô lộ 4 bị Tốt 7 kiểm soát.',
        },
      },
    ],
  },
  {
    id: 'T2-06',
    tier: 2,
    title: 'Bài 2.6: Pháo Trùng (Trùng Pháo Tuyệt Sát)',
    subtitle: 'Hai Pháo chồng trên cùng trục dọc vô hiệu hóa song Sĩ',
    difficulty: 2,
    expReward: 100,
    initialFen: '2baka3/9/9/9/4C4/9/9/1C7/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Chồng hai Pháo trên cùng một trục dọc trung lộ 5, vô hiệu hóa hoàn toàn hàng thủ song Sĩ của Đen.',
    theory:
      'Pháo Trùng: Hai Pháo đứng trên cùng một cột dọc, Pháo sau mượn Pháo trước làm ngòi chiếu Tướng. Sĩ đối phương lên cản lại tạo thành ngòi cho Pháo trước chiếu tiếp.',
    citation: '[3] Quất Trung Bí - Trùng Pháo Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Pháo Đỏ lộ 5 đã chiếm giữ trung lộ.',
      'Gợi ý Cấp 2: Hãy đưa nốt quân Pháo còn lại ở lộ 8 sang trung lộ 5.',
      'Gợi ý Cấp 3: Đi nước P8-5 bình Pháo vào trung lộ tạo thế Pháo Trùng chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 1 },
          to: { r: 7, c: 4 },
          notation: 'P8-5',
          whyBest:
            'P8-5 tạo thế Pháo Trùng: Pháo sau mượn Pháo trước chiếu Tướng; Sĩ Đen lên cản lại thành ngòi cho Pháo trước chiếu tiếp.',
        },
      },
    ],
  },
  {
    id: 'T2-07',
    tier: 2,
    title: 'Bài 2.7: Lưỡng Chiếu (Chiếu Đôi Bất Khả Kháng)',
    subtitle: 'Đòn chiếu đồng thời bằng 2 quân khiến địch không thể trở tay',
    difficulty: 2,
    expReward: 100,
    initialFen: '2baka3/9/4Nc3/9/4P4/9/9/4C4/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Nhảy Mã lộ 5 sang lộ 7 mở đòn Lưỡng chiếu đồng thời với Pháo đầu, vô hiệu hóa Pháo Đen rình ăn Mã.',
    theory:
      'Khi bị Lưỡng chiếu, bên phòng thủ không thể ăn quân chiếu (vì còn quân thứ hai đang chiếu) và cũng không thể che chắn (vì hai đường chiếu khác nhau).',
    citation: '[1][3] WXF Tactical Principles & Quất Trung Bí',
    hints: [
      'Gợi ý Cấp 1: Mã Đỏ lộ 5 đang đứng che đường chiếu của Pháo đầu.',
      'Gợi ý Cấp 2: Nhảy Mã lộ 5 sang lộ 7 chiếu Tướng cùng lúc với Pháo đầu.',
      'Gợi ý Cấp 3: Đi nước M5.7 chiếu đôi tuyệt sát!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 4 },
          to: { r: 1, c: 2 },
          notation: 'M5.7',
          whyBest:
            'M5.7 tạo đòn Lưỡng chiếu (Mã 7 + Pháo 5). Pháo Đen không được phép ăn Mã vì Tướng Đen vẫn đang bị Pháo đầu chiếu.',
        },
      },
    ],
  },
  {
    id: 'T2-08',
    tier: 2,
    title: 'Bài 2.8: Ngọa Tào Phối Hợp Xe Khóa Cung',
    subtitle: 'Mã Ngọa Tào khóa sườn kết hợp Xe khóa cánh đối diện',
    difficulty: 2,
    expReward: 100,
    initialFen: '2bak1b2/4a4/9/1Np6/9/5R3/9/9/9/4K4 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Xe lộ 4 đã khống chế cánh phải, nhảy Mã lộ 8 vào Ngọa Tào lộ 7 chiếu bí.',
    theory:
      'Mã Ngọa Tào khi kết hợp với Xe kiểm soát các lộ xuất tướng sẽ tạo thành gọng kìm siết chết Tướng đối phương ngay trong Cửu cung.',
    citation: '[3] Quất Trung Bí - Ngọa Tào Mã Sát Pháp',
    hints: [
      'Gợi ý Cấp 1: Xe Đỏ ở lộ 4 đang bịt kín sườn bên phải của Tướng Đen.',
      'Gợi ý Cấp 2: Nhảy Mã lộ 8 tiến vào vị trí Ngọa Tào lộ 7.',
      'Gợi ý Cấp 3: Đi nước M8.7 nhảy Mã vào Ngọa Tào chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 3, c: 1 },
          to: { r: 1, c: 2 },
          notation: 'M8.7',
          whyBest:
            'M8.7 vào đúng huyệt Ngọa Tào; Tướng Đen bị Sĩ tự chặn bên trái và Xe Đỏ lộ 4 khóa bên phải nên tuyệt sát.',
        },
      },
    ],
  },

  // ============================================================================
  // TẦNG 3: KHAI CUỘC & CỜ TÀN THỰC DỤNG (6 BÀI TẬP BẢN LỀ)
  // ============================================================================
  {
    id: 'T3-01',
    tier: 3,
    title: 'Bài 3.1: Trung Pháo Đối Bình Phong Mã',
    subtitle: 'Hệ thống đối công kinh điển và hoàn chỉnh nhất lịch sử cờ tướng',
    difficulty: 1,
    expReward: 100,
    initialFen: INITIAL_FEN,
    isMatePuzzle: false,
    objective:
      'Đi chuẩn 4 nước khởi đầu của bên Đỏ theo hệ thống Trung Pháo đối Bình Phong Mã (P2-5, M2.3, X1-2, B7.1).',
    theory:
      'Trung Pháo chủ công trung lộ uy lực mãnh liệt; Bình Phong Mã lập hàng rào đôi Mã vững chãi như tường đồng vách sắt. Đây là cặp kỳ phùng địch thủ chuẩn mực suốt 400 năm qua.',
    citation: '[3][4] Quất Trung Bí (1632) & Mai Hoa Phổ (1692)',
    hints: [
      'Gợi ý Cấp 1: Khởi đầu bằng nước đóng Pháo vào trung lộ uy hiếp Tốt giữa của Đen.',
      'Gợi ý Cấp 2: Phát triển Mã chính quy để bảo vệ Tốt đầu và xuất Xe trực chiến.',
      'Gợi ý Cấp 3: Thứ tự 4 nước của Đỏ: 1. P2-5, 2. M2.3, 3. X1-2, 4. B7.1!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 7 },
          to: { r: 7, c: 4 },
          notation: 'P2-5',
          whyBest: 'P2-5 chiếm lĩnh trung lộ, uy hiếp trực diện Tốt đầu của Đen.',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen lên Mã 7 giữ vững Tốt đầu.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest: 'M2.3 phát triển quân cánh phải, yểm trợ Tốt 3 và Tốt 7.',
        },
        opponentReply: {
          from: { r: 0, c: 8 },
          to: { r: 0, c: 7 },
          notation: 'X9-8',
          note: 'Đen xuất Trực Xa chiếm lộ sườn.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest: 'X1-2 xuất Xe trực chiến chiếm cột thông thoáng.',
        },
        opponentReply: {
          from: { r: 0, c: 1 },
          to: { r: 2, c: 2 },
          notation: 'M2.3',
          note: 'Đen lên nốt Mã 3 tạo thành thế trận Bình Phong Mã hoàn chỉnh.',
        },
      },
      {
        playerMove: {
          from: { r: 6, c: 2 },
          to: { r: 5, c: 2 },
          notation: 'B7.1',
          whyBest: 'B7.1 thông đường cho Mã 7 phát triển và khống chế đầu Mã đối phương.',
        },
        opponentReply: {
          from: { r: 3, c: 6 },
          to: { r: 4, c: 6 },
          notation: 'B7.1',
          note: 'Đen cũng đáp trả bằng B7.1 thông lộ Mã.',
        },
      },
    ],
  },
  {
    id: 'T3-02',
    tier: 3,
    title: 'Bài 3.2: Tiên Nhân Chỉ Lộ B7.1 Chuyển Trung Pháo',
    subtitle: 'Nước cờ thăm dò chiến lược linh hoạt bậc nhất',
    difficulty: 1,
    expReward: 100,
    initialFen: INITIAL_FEN,
    isMatePuzzle: false,
    objective:
      'Dùng B7.1 thăm dò, khi Đen đối công bằng Liễm Pháo P2-3 lập tức đóng Trung Pháo phản kích.',
    theory:
      'Tiên Nhân Chỉ Lộ: Đỏ tiến Tốt 7 hoặc Tốt 3 ngay nước đầu để mở đường cho Mã và thăm dò chiến thuật của đối phương, sau đó linh hoạt chuyển thành Trung Pháo hoặc Phi Tượng.',
    citation: '[5] Đại sư Hồ Vinh Hoa - Khai Cuộc Tiên Nhân Chỉ Lộ',
    hints: [
      'Gợi ý Cấp 1: Thúc Tốt lộ 7 tiến 1 để mở đường cho Mã phóng lên.',
      'Gợi ý Cấp 2: Khi Đen bình Pháo lộ 3 uy hiếp Tượng, hãy chuyển ngay Pháo 2 vào trung lộ.',
      'Gợi ý Cấp 3: Thứ tự nước đi: 1. B7.1, 2. P2-5, 3. M2.3, 4. X1-2!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 6, c: 2 },
          to: { r: 5, c: 2 },
          notation: 'B7.1',
          whyBest: 'B7.1 mở đường thông thoáng cho Mã 7 và thăm dò ý đồ chiến thuật của Đen.',
        },
        opponentReply: {
          from: { r: 2, c: 1 },
          to: { r: 2, c: 2 },
          notation: 'P2-3',
          note: 'Đen chọn Liễm Pháo đối công nhắm vào Tượng Đỏ.',
        },
      },
      {
        playerMove: {
          from: { r: 7, c: 7 },
          to: { r: 7, c: 4 },
          notation: 'P2-5',
          whyBest: 'P2-5 chuyển Trung Pháo công phá trực diện trung lộ khi Đen đã dịch Pháo sang cánh.',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen lên Mã bảo vệ Tốt đầu.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest: 'M2.3 xuất Mã bảo vệ trung tâm.',
        },
        opponentReply: {
          from: { r: 0, c: 2 },
          to: { r: 2, c: 4 },
          notation: 'T3.5',
          note: 'Đen gác Tượng củng cố tuyến giữa.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest: 'X1-2 xuất Xe chiếm lộ 2 khống chế thế trận.',
        },
      },
    ],
  },
  {
    id: 'T3-03',
    tier: 3,
    title: 'Bài 3.3: Khai Cuộc Thuận Pháo (Trực Xa Đối Hoành Xa)',
    subtitle: 'Đôi công rực lửa giữa trực xạ và hoành xạ',
    difficulty: 2,
    expReward: 110,
    initialFen: INITIAL_FEN,
    isMatePuzzle: false,
    objective:
      'Thực hành thế trận Thuận Pháo đối công quyết liệt từ cổ phổ Quất Trung Bí.',
    theory:
      'Thuận Pháo: Cả hai bên cùng đưa Pháo vào trung lộ từ cùng một phía. Thế trận đòi hỏi tốc độ xuất quân thần tốc, tranh Tiên quyết liệt từng ly từng tí.',
    citation: '[3] Quất Trung Bí - Thuận Pháo Trực Xa Phá Hoành Xa',
    hints: [
      'Gợi ý Cấp 1: Đóng Pháo 2 vào trung lộ; khi Đen cũng vào Pháo 8 đối công, phát triển Mã 2 lên 3.',
      'Gợi ý Cấp 2: Xuất Trực Xa lộ 2 thần tốc để khống chế tuyến sườn của Đen.',
      'Gợi ý Cấp 3: Thứ tự nước đi: 1. P2-5, 2. M2.3, 3. X1-2, 4. M8.7!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 7 },
          to: { r: 7, c: 4 },
          notation: 'P2-5',
          whyBest: 'P2-5 công phá trung lộ.',
        },
        opponentReply: {
          from: { r: 2, c: 7 },
          to: { r: 2, c: 4 },
          notation: 'P8-5',
          note: 'Đen đóng Pháo 8 vào trung lộ tạo thế Thuận Pháo đối công.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest: 'M2.3 bảo vệ Tốt đầu.',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen lên Mã 7.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest: 'X1-2 xuất Trực Xa thần tốc.',
        },
        opponentReply: {
          from: { r: 0, c: 8 },
          to: { r: 1, c: 8 },
          notation: 'X9.1',
          note: 'Đen hoành Xe lộ 9 chuẩn bị chuyển cánh.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 1 },
          to: { r: 7, c: 2 },
          notation: 'M8.7',
          whyBest: 'M8.7 củng cố trận hình song Mã bảo hộ trung nguyên.',
        },
        opponentReply: {
          from: { r: 1, c: 8 },
          to: { r: 1, c: 3 },
          notation: 'X9-4',
          note: 'Đen bình Xe sang lộ 4 tranh quyền chủ động.',
        },
      },
    ],
  },
  {
    id: 'T3-04',
    tier: 3,
    title: 'Bài 3.4: Phi Tượng Cuộc T3.5 (Lấy Nhu Thắng Cương)',
    subtitle: 'Thế trận phòng ngự phản công vững như bàn thạch',
    difficulty: 1,
    expReward: 100,
    initialFen: INITIAL_FEN,
    isMatePuzzle: false,
    objective:
      'Gác Tượng lộ 3 củng cố phòng tuyến trung tâm, xuất Trực Xa và thông Tốt 3.',
    theory:
      'Phi Tượng Cuộc: Lên Tượng ngay từ nước đầu tiên, gia cố trung lộ, dẫn dụ đối phương dâng cao đội hình để chờ thời cơ phản công sắc lẹm.',
    citation: '[5] Đặc cấp Đại sư Hồ Vinh Hoa - Phi Tượng Cuộc Tinh Giải',
    hints: [
      'Gợi ý Cấp 1: Gác Tượng cánh phải lộ 3 lên trung tâm.',
      'Gợi ý Cấp 2: Phát triển Mã lộ 2 lên lộ 3 và xuất Xe lộ 1 sang lộ 2.',
      'Gợi ý Cấp 3: Thứ tự 4 nước: 1. T3.5, 2. M2.3, 3. X1-2, 4. B3.1!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 9, c: 6 },
          to: { r: 7, c: 4 },
          notation: 'T3.5',
          whyBest: 'T3.5 củng cố phòng tuyến trung lộ, ổn định thế trận.',
        },
        opponentReply: {
          from: { r: 2, c: 7 },
          to: { r: 2, c: 4 },
          notation: 'P8-5',
          note: 'Đen chuyển Pháo vào trung lộ tấn công.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest: 'M2.3 phát triển Mã giữ vững Tốt đầu.',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen lên Mã 7.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest: 'X1-2 xuất Xe trực diện kiểm soát cột thông.',
        },
        opponentReply: {
          from: { r: 0, c: 8 },
          to: { r: 0, c: 7 },
          notation: 'X9-8',
          note: 'Đen cũng xuất Xe lộ 8.',
        },
      },
      {
        playerMove: {
          from: { r: 6, c: 6 },
          to: { r: 5, c: 6 },
          notation: 'B3.1',
          whyBest: 'B3.1 mở lộ cho Mã 3 phát triển, thế trận vững vàng.',
        },
      },
    ],
  },
  {
    id: 'T3-05',
    tier: 3,
    title: 'Bài 3.5: Khai Cuộc: Trung Pháo Công Phản Cung Mã',
    subtitle: 'Chiến thuật công phá thế trận Phản Cung Mã',
    difficulty: 2,
    expReward: 110,
    initialFen: INITIAL_FEN,
    isMatePuzzle: false,
    objective:
      'Triển khai thế trận công phá bài bản khi đối phương sử dụng trận pháp Phản Cung Mã (P8-6).',
    theory:
      'Phản Cung Mã: Đen đưa một Pháo kẹp giữa hai Mã (P8-6 hoặc P2-4). Bên Đỏ dùng Trung Pháo kết hợp tiến Tốt 7 và xuất Trực Xa để khoét sâu vào điểm yếu sườn của Đen.',
    citation: '[5] Đặc cấp Quốc tế Đại sư Hồ Vinh Hoa - Phản Cung Mã Chuyên Tập',
    hints: [
      'Gợi ý Cấp 1: Đóng Pháo 2 vào trung lộ và phát triển Mã 2 lên lộ 3.',
      'Gợi ý Cấp 2: Xuất Xe 1 bình 2 và tiến Tốt 7 lên 1 để ghìm chặt cánh Mã của Đen.',
      'Gợi ý Cấp 3: Thứ tự nước đi: 1. P2-5, 2. M2.3, 3. X1-2, 4. B7.1!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 7 },
          to: { r: 7, c: 4 },
          notation: 'P2-5',
          whyBest: 'P2-5 đóng Trung Pháo tấn công trực diện.',
        },
        opponentReply: {
          from: { r: 0, c: 1 },
          to: { r: 2, c: 2 },
          notation: 'M2.3',
          note: 'Đen lên Mã 3.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 7 },
          to: { r: 7, c: 6 },
          notation: 'M2.3',
          whyBest: 'M2.3 bảo vệ Tốt đầu.',
        },
        opponentReply: {
          from: { r: 2, c: 7 },
          to: { r: 2, c: 5 },
          notation: 'P8-6',
          note: 'Đen đi P8-6 hình thành thế trận Phản Cung Mã.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 8 },
          to: { r: 9, c: 7 },
          notation: 'X1-2',
          whyBest: 'X1-2 xuất Xe chiếm lộ 2 khống chế cánh Mã Đen.',
        },
        opponentReply: {
          from: { r: 0, c: 7 },
          to: { r: 2, c: 6 },
          notation: 'M8.7',
          note: 'Đen lên nốt Mã 7 kẹp Pháo ở giữa.',
        },
      },
      {
        playerMove: {
          from: { r: 6, c: 2 },
          to: { r: 5, c: 2 },
          notation: 'B7.1',
          whyBest: 'B7.1 thông lộ cho Mã 7 và khống chế Mã đối phương.',
        },
      },
    ],
  },
  {
    id: 'T3-06',
    tier: 3,
    title: 'Bài 3.6: Cờ Tàn Thực Dụng: Mã Tốt Thắng Đơn Sĩ (2 Nước)',
    subtitle: 'Nghệ thuật điều Mã Ngọa Tào và Tốt lụt ép Tướng tuyệt sát',
    difficulty: 2,
    expReward: 150,
    initialFen: '1P2k4/4a4/3P5/1N7/9/9/9/9/9/5K3 r - - 0 1',
    isMatePuzzle: true,
    objective:
      'Phối hợp Mã Ngọa Tào, Tốt lộ 6 và Tốt lụt lộ 8 chiếu bí trong 2 nước không cần Xe Pháo.',
    theory:
      'Trong cờ tàn thực dụng: Mã Tốt có thể tất thắng Đơn Sĩ nếu chiếm giữ được vị trí Ngọa Tào và Tướng đối phương bị đẩy lệch sườn.',
    citation: '[5] Cờ Tàn Thực Dụng Căn Bản - Mã Tốt Thắng Đơn Sĩ',
    hints: [
      'Gợi ý Cấp 1: Mã Đỏ ở lộ 8 nhảy vào Ngọa Tào lộ 7 để chiếu Tướng.',
      'Gợi ý Cấp 2: Tướng Đen bị Tướng Đỏ lộ 4 khóa bên phải nên buộc dạt sang lộ 4.',
      'Gợi ý Cấp 3: Nước 1 đi M8.7, nước 2 đi B8-7 ép Tướng Đen tuyệt sát!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 3, c: 1 },
          to: { r: 1, c: 2 },
          notation: 'M8.7',
          whyBest:
            'Nhảy Mã Ngọa Tào chiếu Tướng, ép Tướng Đen dạt sang lộ 4 vì cánh phải bị Tướng Đỏ lộ 4 khóa.',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen bắt buộc dạt sang lộ 4.',
        },
      },
      {
        playerMove: {
          from: { r: 0, c: 1 },
          to: { r: 0, c: 2 },
          notation: 'B8-7',
          whyBest:
            'Đưa Tốt lụt vào sát vách cung chiếu Tướng. Tướng và Sĩ Đen không được phép ra khỏi cung để ăn Tốt -> Tuyệt sát!',
        },
      },
    ],
  },

  // ============================================================================
  // TẦNG 4: CỜ THẾ GIANG HỒ & DANH CỤC CỔ (TỨ ĐẠI DANH CỤC)
  // ============================================================================
  {
    id: 'T4-01',
    tier: 4,
    title: 'Bài 4.1: Thất Tinh Tụ Hội (七星聚会 - Tụ Hội 7 Sao)',
    subtitle: 'Tuyệt đỉnh cờ thế giang hồ đệ nhất Trung Hoa',
    difficulty: 3,
    expReward: 250,
    timeLimitSec: 180,
    isMatePuzzle: false,
    initialFen: '4rk3/3P5/4bP3/9/9/8P/9/1p2p2C1/3p1p3/4K1RR1 r - - 0 1',
    objective:
      'Trải nghiệm 3 nước đi mở màn kinh điển ("Thoát Mão") của danh cục Thất Tinh Tụ Hội trích từ Bách Cục Tượng Kỳ Phổ (1801).',
    theory:
      'Thất Tinh Tụ Hội (Ngàn sao tụ hội): Mỗi bên đều có 7 quân lớn tham chiến trong một thế trận thiên la địa võng. Đỏ thoạt nhìn bị vây hãm thập phần nguy kịch nhưng lại có đòn bình Pháo phế quân thoát hiểm thần sầu.',
    citation: '[2] Bách Cục Tượng Kỳ Phổ (1801) - Cục 1: Thất Tinh Tụ Hội; Trúc Hương Trai (1814)',
    hints: [
      'Gợi ý Cấp 1: Không được phòng thủ thụ động! Đỏ phải dùng Pháo lộ 2 bình sang lộ 4 chiếu Tướng.',
      'Gợi ý Cấp 2: Sau khi Đen ăn Pháo, thúc Tốt lộ 4 tiến 1 chiếu tiếp dồn ép Tướng Đen trồi lên.',
      'Gợi ý Cấp 3: Nước 1 đi P2-4, nước 2 đi B4.1, nước 3 đi X3.8 đâm Xe sườn chiếu Tướng!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 7, c: 7 },
          to: { r: 7, c: 5 },
          notation: 'P2-4',
          whyBest:
            'Bình Pháo lộ 4 mượn Tốt 4 làm ngòi chiếu Tướng, buộc Đen phải dùng Tốt cản.',
        },
        opponentReply: {
          from: { r: 7, c: 4 },
          to: { r: 7, c: 5 },
          notation: 'B5-6',
          note: 'Tốt Đen bắt buộc phải ăn Pháo Đỏ.',
        },
      },
      {
        playerMove: {
          from: { r: 2, c: 5 },
          to: { r: 1, c: 5 },
          notation: 'B4.1',
          whyBest:
            'Thúc Tốt chiếu Tướng tiếp tục duy trì thế công hiểm hóc.',
        },
        opponentReply: {
          from: { r: 0, c: 5 },
          to: { r: 1, c: 5 },
          notation: 'Tg6.1',
          note: 'Tướng Đen ăn Tốt trồi lên lầu 2.',
        },
      },
      {
        playerMove: {
          from: { r: 9, c: 6 },
          to: { r: 1, c: 6 },
          notation: 'X3.8',
          whyBest:
            'Xe 3 tiến 8 đâm thẳng sườn lầu 2 chiếu Tướng ép Tướng Đen thoái về đáy!',
        },
        opponentReply: {
          from: { r: 1, c: 5 },
          to: { r: 0, c: 5 },
          notation: 'Tg6/1',
          note: 'Tướng Đen thoái về đáy tránh đòn Xe.',
        },
      },
    ],
  },
  {
    id: 'T4-02',
    tier: 4,
    title: 'Bài 4.2: Dã Mã Thao Điền (野马操田 - Ngựa Hoang Dạo Đồng Cỏ)',
    subtitle: 'Thế cờ giang hồ tranh đoạt từng tấc đất',
    difficulty: 3,
    expReward: 250,
    timeLimitSec: 180,
    isMatePuzzle: false,
    initialFen: '2bak4/4a4/4b4/9/6NRR/2B6/1rP1P4/3pB4/4p4/3K5 r - - 0 1',
    objective:
      'Triển khai chuỗi nước đi phá vỡ tuyến phòng ngự Sĩ Tượng của Đen trong thế cờ giang hồ lừng danh Dã Mã Thao Điền.',
    theory:
      'Dã Mã Thao Điền: Thế cờ nghệ thuật nổi tiếng lấy hình tượng tuấn mã phi nước đại nơi đồng cỏ. Bên Đỏ khéo léo dùng Xe xé rách hàng phòng ngự Sĩ Tượng để Mã nhập cuộc.',
    citation: '[2] Trúc Hương Trai Tượng Hí Phổ (Trương Túy Ngọa) & Bách Cục Tượng Kỳ Phổ',
    hints: [
      'Gợi ý Cấp 1: Đâm Xe lộ 1 xuống hàng đáy chiếu Tướng ép Tượng Đen thoái về.',
      'Gợi ý Cấp 2: Dùng Xe chém Tượng đáy ép Sĩ Đen phải thoái về góc.',
      'Gợi ý Cấp 3: Nước 1 đi X1.4, nước 2 đi X1-3, nước 3 đi M3.4 nhảy Mã chiếu Tướng!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 8 },
          to: { r: 0, c: 8 },
          notation: 'X1.4',
          whyBest:
            'Đâm Xe lộ 1 xuống hàng đáy chiếu Tướng ép Tượng Đen phải thoái về cản.',
        },
        opponentReply: {
          from: { r: 2, c: 4 },
          to: { r: 0, c: 6 },
          notation: 'T5/7',
          note: 'Tượng Đen thoái về lộ 7 cản Xe.',
        },
      },
      {
        playerMove: {
          from: { r: 0, c: 8 },
          to: { r: 0, c: 6 },
          notation: 'X1-3',
          whyBest:
            'Chém Tượng đáy chiếu Tướng tiếp tục ép Sĩ Đen phải thoái về góc cung.',
        },
        opponentReply: {
          from: { r: 1, c: 4 },
          to: { r: 0, c: 5 },
          notation: 'S5/6',
          note: 'Sĩ Đen thoái về góc cung.',
        },
      },
      {
        playerMove: {
          from: { r: 4, c: 6 },
          to: { r: 2, c: 5 },
          notation: 'M3.4',
          whyBest:
            'Nhảy Mã vào lộ 4 chiếu Tướng dồn ép Tướng Đen trồi lên lầu 2!',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 1, c: 4 },
          notation: 'Tg5.1',
          note: 'Tướng Đen trồi lên lầu 2.',
        },
      },
    ],
  },
  {
    id: 'T4-03',
    tier: 4,
    title: 'Bài 4.3: Đơn Đao Phó Hội (单刀赴会 - 3 Nước Tuyệt Sát)',
    subtitle: 'Đơn thương độc mã xé rách hàng phòng ngự Cửu cung',
    difficulty: 2,
    expReward: 160,
    timeLimitSec: 150,
    isMatePuzzle: true,
    initialFen: '4k1P2/4a4/4R4/9/9/9/9/9/9/4K4 r - - 0 1',
    objective:
      'Dùng 1 Xe phối hợp Mặt Tướng Đỏ ở trung lộ chém Sĩ tâm cung, ép Tướng Đen Zugzwang rồi chiếu bí từ xa.',
    theory:
      'Đơn Đao Phó Hội: Điển tích Quan Vũ một mình mang long đao đến dự tiệc Đông Ngô. Trong cờ thế, chỉ một quân Xe phối hợp Mặt Tướng có thể bình định cả giang sơn.',
    citation: '[1][6] Cổ Phổ Cờ Tàn Nghệ Thuật & Hiệu chỉnh chuẩn WXF',
    hints: [
      'Gợi ý Cấp 1: Chém Sĩ tâm cung chiếu Tướng dưới sự che chở của Mặt Tướng Đỏ.',
      'Gợi ý Cấp 2: Rút Xe lùi lại 2 bước để dồn Tướng Đen vào thế hết nước đi (Zugzwang).',
      'Gợi ý Cấp 3: Nước 1 đi X5.1, nước 2 đi X5/2, nước 3 đi X5-6 bình Xe chiếu bí!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 2, c: 4 },
          to: { r: 1, c: 4 },
          notation: 'X5.1',
          whyBest:
            'Chém Sĩ tâm cung chiếu Tướng. Mặt Tướng Đỏ lộ 5 bảo vệ Xe nên Tướng Đen buộc đi Tg5-4.',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen bắt buộc dạt sang lộ 4.',
        },
      },
      {
        playerMove: {
          from: { r: 1, c: 4 },
          to: { r: 3, c: 4 },
          notation: 'X5/2',
          whyBest:
            'Nước thoái Xe giữ cự ly an toàn chuẩn đại sư, ép Tướng Đen rơi vào Zugzwang chỉ còn 1 nước Tg4.1.',
        },
        opponentReply: {
          from: { r: 0, c: 3 },
          to: { r: 1, c: 3 },
          notation: 'Tg4.1',
          note: 'Tướng Đen buộc phải trồi lên lầu 2.',
        },
      },
      {
        playerMove: {
          from: { r: 3, c: 4 },
          to: { r: 3, c: 3 },
          notation: 'X5-6',
          whyBest:
            'Bình Xe sang lộ 6 chiếu Tướng từ xa, Tướng Đỏ khóa lộ 5 -> Tuyệt sát!',
        },
      },
    ],
  },
  {
    id: 'T4-04',
    tier: 4,
    title: 'Bài 4.4: Thiên Lý Độc Hành (千里独行 - 2 Nước Tuyệt Sát)',
    subtitle: 'Nghệ thuật phế Xe khai lộ đưa Mã Hậu Pháo vào sát cục',
    difficulty: 3,
    expReward: 200,
    timeLimitSec: 180,
    isMatePuzzle: true,
    initialFen: '2baka3/9/P8/5N3/3Rp4/9/9/3C5/9/4K4 r - - 0 1',
    objective:
      'Dũng cảm phế Xe ăn Sĩ đáy của Đen để lôi Tướng địch ra sườn lộ 4 rồi nhảy Mã Hậu Pháo kết liễu.',
    theory:
      'Thiên Lý Độc Hành: Phế quân Xe chủ lực nhằm kéo Tướng đối phương vào cạm bẫy Mã Hậu Pháo định mệnh.',
    citation: '[3] Cổ Phổ Giang Hồ Sát Pháp & Quất Trung Bí',
    hints: [
      'Gợi ý Cấp 1: Đừng tiếc quân Xe ở lộ 6! Hãy đâm xuống ăn Sĩ đáy chiếu Tướng.',
      'Gợi ý Cấp 2: Sau khi Tướng Đen ăn Xe ra sườn, hãy dùng Mã lộ 4 nhảy vào lộ 6.',
      'Gợi ý Cấp 3: Nước 1 đi X6.4, nước 2 đi M4.6 tạo thế Mã Hậu Pháo tuyệt sát!',
    ],
    steps: [
      {
        playerMove: {
          from: { r: 4, c: 3 },
          to: { r: 0, c: 3 },
          notation: 'X6.4',
          whyBest:
            'Phế Xe ăn Sĩ đáy giải phóng đường dọc lộ 6 và lôi Tướng Đen ra sườn.',
        },
        opponentReply: {
          from: { r: 0, c: 4 },
          to: { r: 0, c: 3 },
          notation: 'Tg5-4',
          note: 'Tướng Đen buộc phải ăn Xe ra lộ 4.',
        },
      },
      {
        playerMove: {
          from: { r: 3, c: 5 },
          to: { r: 2, c: 3 },
          notation: 'M4.6',
          whyBest:
            'Nhảy Mã vào lộ 6 vừa khóa lộ 5 không cho Tướng Đen quay về, vừa làm ngòi cho Pháo lộ 6 chiếu bí (Mã Hậu Pháo).',
        },
      },
    ],
  },
];
