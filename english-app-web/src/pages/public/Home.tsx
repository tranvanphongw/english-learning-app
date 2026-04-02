import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Brain, 
  Globe, 
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Smartphone,
  Download
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const learningFeatures = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Bài học tương tác",
      description: "Bài học hấp dẫn trên mobile được thiết kế bởi giáo viên chuyên nghiệp. Học ngữ pháp, từ vựng và kỹ năng giao tiếp từng bước.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video bài học",
      description: "Xem video giáo dục với người bản ngữ ngay trên điện thoại. Cải thiện kỹ năng nghe và phát âm một cách tự nhiên.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Quiz thông minh",
      description: "Kiểm tra kiến thức với quiz thích ứng trên mobile. Nhận phản hồi tức thì và theo dõi tiến trình của bạn.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Xây dựng từ vựng",
      description: "Mở rộng vốn từ vựng với flashcard, danh sách từ và lặp lại có khoảng cách. Học từ trong ngữ cảnh trên mobile.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Dịch thuật AI",
      description: "Dịch giữa tiếng Anh và tiếng Việt ngay lập tức trên app. Hiểu ngữ cảnh và học cách sử dụng đúng.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Theo dõi tiến trình",
      description: "Theo dõi hành trình học tập với phân tích chi tiết trên mobile. Xem sự cải thiện và kỷ niệm các cột mốc.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const benefits = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Học mọi lúc mọi nơi",
      description: "Học trên điện thoại bất cứ đâu, bất cứ khi nào. Phù hợp với lịch trình bận rộn của bạn với các khóa học linh hoạt."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Kết quả đã được chứng minh",
      description: "Tham gia cùng hàng nghìn học viên đã cải thiện kỹ năng tiếng Anh. Thấy tiến bộ rõ rệt trong vài tuần."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Giáo viên chuyên nghiệp",
      description: "Học từ các nhà giáo dục giàu kinh nghiệm và người bản ngữ. Nhận phản hồi và hướng dẫn cá nhân hóa."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Học tập với AI",
      description: "Công nghệ học tập thích ứng điều chỉnh theo trình độ của bạn. Tập trung vào các lĩnh vực cần cải thiện."
    }
  ];

  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      role: "Học viên",
      content: "Tôi đã cải thiện tiếng Anh từ trình độ cơ bản lên trung cấp chỉ trong 3 tháng! Ứng dụng mobile rất tiện lợi, tôi có thể học mọi lúc mọi nơi.",
      rating: 5,
      avatar: "👩‍🎓"
    },
    {
      name: "Trần Văn Hùng",
      role: "Chuyên gia kinh doanh",
      content: "Tính năng xây dựng từ vựng và dịch thuật trên app thật tuyệt vời. Giờ tôi có thể giao tiếp tự tin với khách hàng quốc tế.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Lê Thị Mai",
      role: "Sinh viên đại học",
      content: "Video bài học với người bản ngữ trên mobile thực sự giúp tôi cải thiện phát âm. Điểm IELTS của tôi đã tăng 2 điểm!",
      rating: 5,
      avatar: "👩‍🎓"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Tải ứng dụng",
      description: "Tải ứng dụng miễn phí từ App Store hoặc Google Play. Tạo tài khoản trong vài giây, không cần thẻ tín dụng."
    },
    {
      step: "2",
      title: "Kiểm tra trình độ",
      description: "Hoàn thành bài kiểm tra nhanh để xác định trình độ tiếng Anh hiện tại. Chúng tôi sẽ cá nhân hóa lộ trình học cho bạn."
    },
    {
      step: "3",
      title: "Bắt đầu học",
      description: "Truy cập bài học, video, quiz và bài tập từ vựng ngay trên mobile. Học theo tốc độ của riêng bạn với chương trình có cấu trúc."
    },
    {
      step: "4",
      title: "Theo dõi tiến trình",
      description: "Theo dõi sự cải thiện với phân tích chi tiết trên app. Kỷ niệm các cột mốc và duy trì động lực học tập."
    }
  ];

  const faqs = [
    {
      question: "Ứng dụng có miễn phí không?",
      answer: "Có! Ứng dụng mobile của chúng tôi miễn phí với các tính năng cơ bản. Gói Premium bắt đầu từ 99.000đ/tháng với quyền truy cập đầy đủ vào tất cả bài học, video và tính năng nâng cao."
    },
    {
      question: "Tôi có cần biết tiếng Anh để bắt đầu không?",
      answer: "Hoàn toàn không! Ứng dụng mobile của chúng tôi được thiết kế cho mọi trình độ, từ người mới bắt đầu hoàn toàn đến người học nâng cao. Chúng tôi sẽ đánh giá trình độ của bạn và cung cấp nội dung phù hợp."
    },
    {
      question: "Tôi có thể học trên điện thoại không?",
      answer: "Đúng vậy! Ứng dụng mobile của chúng tôi có sẵn cho iOS và Android. Học mọi lúc mọi nơi và đồng bộ tiến trình của bạn trên tất cả các thiết bị. Bạn cũng có thể tải bài học về để học offline."
    },
    {
      question: "Mất bao lâu để thấy kết quả?",
      answer: "Hầu hết học viên nhận thấy sự cải thiện trong vòng 2-4 tuần luyện tập đều đặn. Kết quả khác nhau tùy thuộc vào trình độ ban đầu và thời gian học tập của bạn."
    },
    {
      question: "Giáo viên có phải người bản ngữ không?",
      answer: "Có, nội dung video của chúng tôi có người nói tiếng Anh bản ngữ, và chương trình giảng dạy được thiết kế bởi các giáo viên tiếng Anh được chứng nhận."
    },
    {
      question: "Tôi có thể hủy bất cứ lúc nào không?",
      answer: "Chắc chắn rồi! Bạn có thể hủy đăng ký bất cứ lúc nào. Tiến trình và dữ liệu của bạn sẽ được lưu, và bạn có thể quay lại bất cứ lúc nào."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">English Learning</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Testimonials</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">FAQ</a>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              >
                Start Learning
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Testimonials</a>
              <a href="#faq" className="block px-3 py-2 text-gray-600 hover:text-gray-900">FAQ</a>
              <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link to="/register" className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center font-semibold">Start Learning</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Smartphone className="w-4 h-4 mr-2" />
                Ứng dụng Mobile - Học mọi lúc mọi nơi
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Học Tiếng Anh
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Trên Điện Thoại</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Ứng dụng học tiếng Anh trên mobile với bài học tương tác, video, quiz và dịch thuật AI. 
                Học mọi lúc mọi nơi, ngay trên điện thoại của bạn.
              </p>
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-700 mb-4">Tải ứng dụng ngay:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-1.44-1.56-.62-2.36-1.05-2.36-2.16v-1.4c0-.83.67-1.5 1.5-1.5h9c.83 0 1.5.67 1.5 1.5v1.39c0 1.07-.7 1.47-1.22 1.68-.1.04-.2.08-.3.11zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    App Store
                  </button>
                  <button className="group bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L15.19,17.22L13.69,15.72L19.69,12L13.69,8.28L15.19,6.78L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    Google Play
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/register"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center"
                >
                  Đăng ký tài khoản
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/login"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-lg hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
                >
                  Đăng nhập
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-blue-500 mr-2" />
                  <span>Ứng dụng Mobile</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Miễn phí
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Học offline
                </div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              {/* Mobile Phone Mockup */}
              <div className="relative w-64 h-[500px]">
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-8 flex items-center justify-between px-4 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-4 h-[calc(100%-2rem)] overflow-y-auto bg-gray-50">
                      <div className="mb-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900 text-sm">Bài học hôm nay</div>
                            <div className="text-xs text-gray-600">Ngữ pháp & Từ vựng</div>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full mb-1">
                          <div className="h-2 bg-blue-600 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <div className="text-xs text-gray-600">75% hoàn thành</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-gray-900 text-sm">Tiến độ học tập</div>
                          <Award className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-lg font-bold text-gray-900">28</div>
                            <div className="text-xs text-gray-600">Bài học</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900">156</div>
                            <div className="text-xs text-gray-600">Từ vựng</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900">12</div>
                            <div className="text-xs text-gray-600">Ngày liên tiếp</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center">
                            <Video className="w-5 h-5 text-purple-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Video bài học</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center">
                            <Brain className="w-5 h-5 text-pink-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">Làm quiz</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Người dùng Mobile</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Bài học</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Từ vựng</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-gray-600">Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Smartphone className="w-4 h-4 mr-2" />
              Ứng dụng Mobile đầy đủ tính năng
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mọi thứ bạn cần để học tiếng Anh
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tất cả công cụ và tài liệu học tập được tối ưu cho mobile. Học tiếng Anh hiệu quả ngay trên điện thoại của bạn.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 bg-white"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tại sao chọn ứng dụng của chúng tôi?
            </h2>
            <p className="text-xl text-gray-600">
              Tham gia cùng hàng nghìn người học tiếng Anh thành công trên mobile
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Smartphone className="w-4 h-4 mr-2" />
                Ứng dụng Mobile
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Học tiếng Anh trên điện thoại của bạn
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Ứng dụng được tối ưu hóa cho mobile với giao diện thân thiện, dễ sử dụng. 
                Tải xuống và bắt đầu học ngay hôm nay!
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-lg mb-1">Học offline</div>
                    <div className="text-blue-100">Tải bài học về và học ngay cả khi không có internet</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-lg mb-1">Đồng bộ đa thiết bị</div>
                    <div className="text-blue-100">Tiến trình học tập được đồng bộ trên mọi thiết bị của bạn</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-white mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-lg mb-1">Thông báo nhắc nhở</div>
                    <div className="text-blue-100">Nhận thông báo để duy trì thói quen học tập hàng ngày</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Tải App Store
                </button>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Tải Google Play
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-64 h-[500px]">
                <div className="absolute inset-0 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-8"></div>
                    <div className="p-4 h-[calc(100%-2rem)] bg-gradient-to-br from-blue-50 to-purple-50">
                      <div className="text-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-white" />
                        </div>
                        <div className="font-bold text-gray-900 text-lg">English Learning</div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 shadow-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900 text-sm">Bài học hôm nay</span>
                            <span className="text-xs text-blue-600 font-medium">Mới</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-blue-600 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-md">
                          <div className="flex items-center mb-2">
                            <Video className="w-5 h-5 text-purple-500 mr-2" />
                            <span className="font-semibold text-gray-900 text-sm">Video bài học</span>
                          </div>
                          <div className="text-xs text-gray-600">5 video mới</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-md">
                          <div className="flex items-center mb-2">
                            <Brain className="w-5 h-5 text-pink-500 mr-2" />
                            <span className="font-semibold text-gray-900 text-sm">Làm quiz</span>
                          </div>
                          <div className="text-xs text-gray-600">Kiểm tra kiến thức</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cách sử dụng
            </h2>
            <p className="text-xl text-gray-600">
              Bắt đầu trong vài phút và học ngay trên mobile
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Học viên nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600">
              Câu chuyện thật từ những người học thật
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-xl text-gray-600">
              Mọi thứ bạn cần biết về học tiếng Anh với ứng dụng mobile của chúng tôi
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu học tiếng Anh?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Tham gia cùng hàng nghìn học viên đang cải thiện kỹ năng tiếng Anh trên mobile. Tải ứng dụng miễn phí ngay hôm nay.
          </p>
          <div className="flex flex-col gap-4 justify-center items-center mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Tải App Store
              </button>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" />
                Tải Google Play
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center"
              >
                Đăng ký tài khoản
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/login"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">English Learning</span>
              </div>
              <p className="text-gray-400">
                Học tiếng Anh trên mobile với bài học tương tác, video và công cụ AI.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Learn</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lessons</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Vocabulary</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 English Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
