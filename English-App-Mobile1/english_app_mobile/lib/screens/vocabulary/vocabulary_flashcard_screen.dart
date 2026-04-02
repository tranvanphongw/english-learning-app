import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../api/api_client.dart';
import '../../config/api_config.dart';

class VocabularyFlashcardScreen extends StatefulWidget {
  final String lessonId;
  final String lessonTitle;
  final String? topicId; // Thêm topicId
  final String? topicTitle; // Thêm topicTitle
  final List<dynamic>? initialVocabularies;

  const VocabularyFlashcardScreen({
    super.key,
    required this.lessonId,
    required this.lessonTitle,
    this.topicId,
    this.topicTitle,
    this.initialVocabularies,
  });

  @override
  State<VocabularyFlashcardScreen> createState() =>
      _VocabularyFlashcardScreenState();
}

class _VocabularyFlashcardScreenState extends State<VocabularyFlashcardScreen>
    with SingleTickerProviderStateMixin {
  final FlutterTts _flutterTts = FlutterTts();
  List<dynamic> _vocabularies = [];
  int _currentIndex = 0;
  bool _isFlipped = false;
  bool _isLoading = true;
  String? _error;
  bool _isSpeaking = false;

  late AnimationController _flipController;
  late Animation<double> _flipAnimation;

  @override
  void initState() {
    super.initState();
    _flipController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _flipAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _flipController, curve: Curves.easeInOut),
    );
    _initTts();
    _fetchVocabularies();
  }

  Future<void> _initTts() async {
    await _flutterTts.setLanguage("en-US");
    await _flutterTts.setSpeechRate(0.5); // Tốc độ nói (0.0 - 1.0)
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);

    _flutterTts.setStartHandler(() {
      setState(() {
        _isSpeaking = true;
      });
    });

    _flutterTts.setCompletionHandler(() {
      setState(() {
        _isSpeaking = false;
      });
    });

    _flutterTts.setErrorHandler((msg) {
      setState(() {
        _isSpeaking = false;
      });
      debugPrint("TTS Error: $msg");
    });
  }

  Future<void> _speak(String text) async {
    if (_isSpeaking) {
      await _flutterTts.stop();
    }
    await _flutterTts.speak(text);
  }

  Future<void> _speakWord() async {
    if (_vocabularies.isEmpty) return;
    final vocab = _vocabularies[_currentIndex];
    final word = vocab['word'] ?? '';
    await _speak(word);
  }

  // TODO: Sử dụng hàm này khi cần phát âm example
  // Future<void> _speakExample() async {
  //   if (_vocabularies.isEmpty) return;
  //   final vocab = _vocabularies[_currentIndex];
  //   final example = vocab['example'] ?? '';
  //   if (example.isNotEmpty) {
  //     await _speak(example);
  //   }
  // }

  Future<void> _fetchVocabularies() async {
    if (!mounted) return;

    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      // Nếu đã có danh sách vocab được truyền vào, dùng luôn
      if (widget.initialVocabularies != null &&
          widget.initialVocabularies!.isNotEmpty) {
        if (!mounted) return;
        setState(() {
          _vocabularies = List.from(widget.initialVocabularies!);
          _isLoading = false;
          _error = null;
        });
        debugPrint('✅ Using initial vocabularies (${_vocabularies.length})');
        return;
      }

      // Ưu tiên fetch theo topicId nếu có (Normal mode), nếu không thì fetch theo lessonId (Rank mode)
      String url;
      if (widget.topicId != null && widget.topicId!.isNotEmpty) {
        // Normal mode: fetch theo topic
        url = '${ApiConfig.vocabByTopicEndpoint}/${widget.topicId}';
        debugPrint('🔍 Fetching vocabularies by topic: ${widget.topicId}');
      } else {
        // Rank mode: fetch theo lesson
        url = '${ApiConfig.vocabEndpoint}/lesson/${widget.lessonId}';
        debugPrint('🔍 Fetching vocabularies by lesson: ${widget.lessonId}');
      }

      final response = await dio.get(url);

      if (!mounted) return;

      final data = response.data;
      List<dynamic> vocabList = [];

      if (data is List) {
        vocabList = data;
      } else if (data is Map && data.containsKey('vocabs')) {
        vocabList = List.from(data['vocabs'] ?? []);
      } else if (data is Map && data.containsKey('items')) {
        vocabList = List.from(data['items'] ?? []);
      } else {
        debugPrint('❌ Unexpected response format for vocab: $data');
      }

      if (!mounted) return;
      setState(() {
        _vocabularies = vocabList;
        _isLoading = false;
        _error = vocabList.isEmpty ? 'Chưa có từ vựng cho bài học này' : null;
      });
      debugPrint('📊 Loaded vocabularies: ${_vocabularies.length}');
    } catch (e, st) {
      debugPrint('❌ Error fetching vocabularies: $e\n$st');
      if (mounted) {
        setState(() {
          _error = 'Không thể tải từ vựng';
          _isLoading = false;
        });
      }
    }
  }

  void _flipCard() {
    if (_isFlipped) {
      _flipController.reverse();
    } else {
      _flipController.forward();
    }
    setState(() {
      _isFlipped = !_isFlipped;
    });
  }

  void _nextCard() {
    if (_currentIndex < _vocabularies.length - 1) {
      setState(() {
        _currentIndex++;
        if (_isFlipped) {
          _flipController.reverse();
          _isFlipped = false;
        }
      });
    }
  }

  void _previousCard() {
    if (_currentIndex > 0) {
      setState(() {
        _currentIndex--;
        if (_isFlipped) {
          _flipController.reverse();
          _isFlipped = false;
        }
      });
    }
  }

  @override
  void dispose() {
    _flipController.dispose();
    _flutterTts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.blue.shade50, Colors.purple.shade50],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios_rounded),
                      onPressed: () => Navigator.pop(context),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.lessonTitle,
                            style: GoogleFonts.inter(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              letterSpacing: -0.3,
                            ),
                          ),
                          Text(
                            'Luyện từ vựng',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: Colors.black54,
                              letterSpacing: 0.1,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (!_isLoading && _vocabularies.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade100,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '${_currentIndex + 1}/${_vocabularies.length}',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Colors.blue.shade700,
                            letterSpacing: 0.2,
                          ),
                        ),
                      ),
                  ],
                ),
              ),

              // Progress bar
              if (!_isLoading && _vocabularies.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: LinearProgressIndicator(
                    value: (_currentIndex + 1) / _vocabularies.length,
                    backgroundColor: Colors.grey.shade200,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Colors.blue.shade600,
                    ),
                    minHeight: 6,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),

              const SizedBox(height: 30),

              // Content
              Expanded(
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : _error != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.error_outline,
                              size: 80,
                              color: Colors.red.shade300,
                            ),
                            const SizedBox(height: 20),
                            Text(
                              _error!,
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                color: Colors.black54,
                                letterSpacing: 0.1,
                              ),
                            ),
                            const SizedBox(height: 20),
                            ElevatedButton.icon(
                              onPressed: _fetchVocabularies,
                              icon: const Icon(Icons.refresh),
                              label: const Text('Thử lại'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.blue,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 24,
                                  vertical: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      )
                    : _buildFlashcard(),
              ),

              // Navigation buttons
              if (!_isLoading && _vocabularies.isNotEmpty)
                SafeArea(
                  top: false,
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(
                      16,
                      16,
                      16,
                      16 + MediaQuery.of(context).viewPadding.bottom,
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _currentIndex > 0 ? _previousCard : null,
                            icon: const Icon(
                              Icons.arrow_back_rounded,
                              size: 18,
                            ),
                            label: const Text(
                              'Trước',
                              overflow: TextOverflow.ellipsis,
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue.shade600,
                              disabledBackgroundColor: Colors.grey.shade300,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),

                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _flipCard,
                            icon: const Icon(Icons.flip_rounded, size: 18),
                            label: Text(
                              _isFlipped ? 'Lật lại' : 'Xem nghĩa',
                              overflow: TextOverflow.ellipsis,
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF6366F1),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),

                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _currentIndex < _vocabularies.length - 1
                                ? _nextCard
                                : null,
                            icon: const Icon(
                              Icons.arrow_forward_rounded,
                              size: 18,
                            ),
                            label: const Text(
                              'Tiếp',
                              overflow: TextOverflow.ellipsis,
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue.shade600,
                              disabledBackgroundColor: Colors.grey.shade300,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFlashcard() {
    final vocab = _vocabularies[_currentIndex];

    return GestureDetector(
      onTap: _flipCard,
      child: Center(
        child: AnimatedBuilder(
          animation: _flipAnimation,
          builder: (context, child) {
            final angle = _flipAnimation.value * pi;
            final isBack = angle > pi / 2;

            return Transform(
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001)
                ..rotateY(angle),
              alignment: Alignment.center,
              child: isBack
                  ? Transform(
                      transform: Matrix4.identity()..rotateY(pi),
                      alignment: Alignment.center,
                      child: _buildCardBack(vocab),
                    )
                  : _buildCardFront(vocab),
            );
          },
        ),
      ),
    );
  }

  Widget _buildCardFront(dynamic vocab) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(30),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF3B82F6), // Blue dịu nhẹ
            const Color(0xFF2563EB), // Blue đậm hơn
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF3B82F6).withValues(alpha: 0.4),
            blurRadius: 24,
            offset: const Offset(0, 12),
            spreadRadius: 2,
          ),
        ],
      ),
      child: Stack(
        children: [
          // Speaker button
          Positioned(
            top: 0,
            right: 0,
            child: IconButton(
              onPressed: _speakWord,
              icon: Icon(
                _isSpeaking ? Icons.volume_up : Icons.volume_up_outlined,
                color: Colors.white,
                size: 32,
              ),
              style: IconButton.styleFrom(
                backgroundColor: Colors.white.withValues(alpha: 0.2),
                padding: const EdgeInsets.all(12),
              ),
            ),
          ),

          // Card content
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.menu_book_rounded,
                size: 60,
                color: Colors.white,
              ),
              const SizedBox(height: 30),
              Text(
                vocab['word'] ?? '',
                style: GoogleFonts.inter(
                  fontSize: 42,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                  letterSpacing: -1,
                ),
                textAlign: TextAlign.center,
              ),
              if (vocab['phonetic'] != null) ...[
                const SizedBox(height: 10),
                Text(
                  vocab['phonetic'] ?? '',
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    color: Colors.white.withValues(alpha: 0.95),
                    fontStyle: FontStyle.italic,
                    letterSpacing: 0.5,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
              if (vocab['partOfSpeech'] != null) ...[
                const SizedBox(height: 15),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    vocab['partOfSpeech'],
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.3,
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 30),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.touch_app, size: 16, color: Colors.white70),
                  const SizedBox(width: 8),
                  Text(
                    'Chạm để xem nghĩa',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.white.withValues(alpha: 0.9),
                      letterSpacing: 0.2,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCardBack(dynamic vocab) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(30),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            const Color(0xFF8B5CF6), // Purple dịu nhẹ
            const Color(0xFF7C3AED), // Purple đậm hơn
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF8B5CF6).withValues(alpha: 0.4),
            blurRadius: 24,
            offset: const Offset(0, 12),
            spreadRadius: 2,
          ),
        ],
      ),
      child: Stack(
        children: [
          // Card content (no speaker button on back side)
          SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Text(
                    vocab['meaning'] ?? '',
                    style: GoogleFonts.inter(
                      fontSize: 34,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 30),
                if (vocab['example'] != null) ...[
                  _buildInfoSection(
                    icon: Icons.format_quote_rounded,
                    title: 'Ví dụ',
                    content: vocab['example'],
                  ),
                  const SizedBox(height: 15),
                ],
                if (vocab['exampleTranslation'] != null) ...[
                  _buildInfoSection(
                    icon: Icons.translate_rounded,
                    title: 'Dịch',
                    content: vocab['exampleTranslation'],
                  ),
                  const SizedBox(height: 15),
                ],
                if (vocab['synonyms'] != null &&
                    (vocab['synonyms'] as List).isNotEmpty) ...[
                  _buildInfoSection(
                    icon: Icons.compare_arrows_rounded,
                    title: 'Từ đồng nghĩa',
                    content: (vocab['synonyms'] as List).join(', '),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoSection({
    required IconData icon,
    required String title,
    required String content,
  }) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(15),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.white, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: Colors.white.withValues(alpha: 0.9),
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.3,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  content,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    color: Colors.white,
                    letterSpacing: 0.1,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
