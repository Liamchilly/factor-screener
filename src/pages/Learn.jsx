import React, { useState, useEffect, useRef } from 'react';
import { LESSONS } from '../data/learnContent';
import { QUIZZES } from '../data/quizData';
import { GLOSSARY_TERMS } from '../data/glossaryData';

const QUIZ_LS_KEY = 'bullet_quiz_scores';

function loadScores() {
  try { return JSON.parse(localStorage.getItem(QUIZ_LS_KEY)) || {}; }
  catch { return {}; }
}

function saveScore(id, score) {
  const existing = loadScores();
  existing[id] = score;
  localStorage.setItem(QUIZ_LS_KEY, JSON.stringify(existing));
}

function LessonPage({ lesson, theme, onNavigate }) {
  const t = theme || {};
  const GLOSSARY_TERM_NAMES = new Set(GLOSSARY_TERMS.map(g => g.term.toLowerCase()));

  const handleTermClick = (term) => {
    onNavigate('glossary', term);
  };

  const renderParagraph = (para, idx) => {
    const words = para.split(/(\s+)/);
    return (
      <p key={idx} style={{ fontSize: '15px', lineHeight: '1.8', color: t.text, margin: '0 0 20px 0' }}>
        {words.map((word, wi) => {
          const clean = word.replace(/[.,!?;:'"()]/g, '').toLowerCase();
          if (GLOSSARY_TERM_NAMES.has(clean)) {
            return (
              <span
                key={wi}
                onClick={() => handleTermClick(clean)}
                style={{ color: t.accent, textDecoration: 'underline dotted', cursor: 'pointer' }}
              >
                {word}
              </span>
            );
          }
          return <span key={wi}>{word}</span>;
        })}
      </p>
    );
  };

  const paragraphs = lesson.content.split('\n\n').filter(Boolean);

  return (
    <div style={{ padding: '40px 32px', maxWidth: '720px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>{lesson.title}</h1>
      <p style={{ fontSize: '12px', color: t.textMuted, margin: '0 0 36px 0' }}>{lesson.readTime}</p>
      {paragraphs.map((para, i) => renderParagraph(para, i))}
      {lesson.next && (
        <div style={{ marginTop: '40px', borderTop: `1px solid ${t.border}`, paddingTop: '24px' }}>
          <button
            onClick={() => onNavigate(lesson.next)}
            style={{
              background: t.accent,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Next Lesson →
          </button>
        </div>
      )}
    </div>
  );
}

function QuizRunner({ quiz, theme, onBack }) {
  const t = theme || {};
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const q = quiz.questions[current];

  const choose = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answer) setCorrect(prev => prev + 1);
  };

  const next = () => {
    if (current + 1 >= quiz.questions.length) {
      const finalScore = selected === q.answer ? correct + 1 : correct;
      saveScore(quiz.id, `${finalScore}/${quiz.questions.length}`);
      setDone(true);
    } else {
      setCurrent(prev => prev + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setCorrect(0);
    setDone(false);
  };

  if (done) {
    const finalScore = correct;
    const pct = (finalScore / quiz.questions.length) * 100;
    const msg = pct === 100 ? 'Perfect score!' : pct >= 80 ? 'Great work!' : pct >= 60 ? 'Good effort!' : 'Keep practicing!';
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', maxWidth: '480px' }}>
        <div style={{ fontSize: '48px', fontWeight: '700', color: t.accent, marginBottom: '8px' }}>{finalScore}/{quiz.questions.length}</div>
        <div style={{ fontSize: '20px', fontWeight: '600', color: t.text, marginBottom: '32px' }}>{msg}</div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={reset} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Try Again</button>
          <button onClick={onBack} style={{ background: t.bgTertiary, color: t.textSecondary, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px 24px', fontSize: '14px', cursor: 'pointer' }}>Back to Quizzes</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '600px' }}>
      <div style={{ fontSize: '12px', color: t.textMuted, marginBottom: '24px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {quiz.label} · Question {current + 1} of {quiz.questions.length}
      </div>
      <div style={{ height: '4px', background: t.progressBg, borderRadius: '4px', marginBottom: '32px' }}>
        <div style={{ height: '100%', background: t.accent, borderRadius: '4px', width: `${((current) / quiz.questions.length) * 100}%`, transition: 'width 0.3s ease' }} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: t.text, lineHeight: '1.5', margin: '0 0 24px 0' }}>{q.q}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {q.options.map((opt, idx) => {
          let bg = t.bgCard;
          let border = `1px solid ${t.border}`;
          let color = t.text;
          if (answered) {
            if (idx === q.answer) { bg = '#0f2a1a'; border = '1px solid #4ade80'; color = '#4ade80'; }
            else if (idx === selected && idx !== q.answer) { bg = '#1a0f0f'; border = '1px solid #f87171'; color = '#f87171'; }
          } else if (selected === idx) {
            bg = t.accentBg; border = `1px solid ${t.accent}`; color = t.accent;
          }
          return (
            <button key={idx} onClick={() => choose(idx)} style={{ background: bg, border, color, borderRadius: '8px', padding: '14px 18px', fontSize: '14px', cursor: answered ? 'default' : 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif', lineHeight: '1.4', transition: 'all 0.1s ease' }}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ background: t.bgTertiary, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '14px 18px', marginBottom: '20px' }}>
          <span style={{ fontSize: '13px', color: t.textSecondary }}>{q.explanation}</span>
        </div>
      )}
      {answered && (
        <button onClick={next} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          {current + 1 >= quiz.questions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

function QuizPage({ theme }) {
  const t = theme || {};
  const [activeQuiz, setActiveQuiz] = useState(null);
  const scores = loadScores();

  if (activeQuiz) {
    const quiz = QUIZZES.find(q => q.id === activeQuiz);
    return <QuizRunner quiz={quiz} theme={theme} onBack={() => setActiveQuiz(null)} />;
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Quiz</h1>
      <p style={{ fontSize: '14px', color: t.textSecondary, margin: '0 0 32px 0' }}>Test your knowledge. 5 questions per topic.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {QUIZZES.map(quiz => (
          <div
            key={quiz.id}
            onClick={() => setActiveQuiz(quiz.id)}
            style={{
              background: t.bgCard,
              border: `1px solid ${t.border}`,
              borderRadius: '10px',
              padding: '20px',
              cursor: 'pointer',
              boxShadow: t.shadow,
              transition: 'background 0.1s ease',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: '600', color: t.text, marginBottom: '8px' }}>{quiz.label}</div>
            {scores[quiz.id] ? (
              <div style={{ fontSize: '13px', color: t.accent, fontWeight: '600' }}>Last score: {scores[quiz.id]}</div>
            ) : (
              <div style={{ fontSize: '12px', color: t.textMuted }}>Not attempted</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GlossaryPage({ theme, highlightTerm }) {
  const t = theme || {};
  const [search, setSearch] = useState('');
  const termRefs = useRef({});

  const sorted = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term));

  const filtered = search
    ? sorted.filter(g => g.term.toLowerCase().includes(search.toLowerCase()) || g.definition.toLowerCase().includes(search.toLowerCase()))
    : sorted;

  const letters = [...new Set(sorted.map(g => g.term[0].toUpperCase()))].sort();
  const filteredLetters = [...new Set(filtered.map(g => g.term[0].toUpperCase()))].sort();

  useEffect(() => {
    if (highlightTerm) {
      const found = sorted.find(g => g.term.toLowerCase() === highlightTerm.toLowerCase() || g.term.toLowerCase().includes(highlightTerm));
      if (found && termRefs.current[found.term]) {
        termRefs.current[found.term].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightTerm, sorted]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToLetter = (letter) => {
    const first = filtered.find(g => g.term[0].toUpperCase() === letter);
    if (first && termRefs.current[first.term]) {
      termRefs.current[first.term].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ padding: '40px 32px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', margin: '0 0 20px 0' }}>Glossary</h1>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search terms..."
        style={{
          width: '100%',
          padding: '10px 16px',
          background: t.inputBg,
          border: `1px solid ${t.inputBorder}`,
          borderRadius: '8px',
          color: t.text,
          fontSize: '14px',
          outline: 'none',
          marginBottom: '16px',
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
        }}
      />
      {!search && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '28px' }}>
          {letters.map(l => (
            <button
              key={l}
              onClick={() => scrollToLetter(l)}
              style={{
                background: filteredLetters.includes(l) ? t.accentBg : t.bgTertiary,
                border: `1px solid ${filteredLetters.includes(l) ? t.accent : t.border}`,
                color: filteredLetters.includes(l) ? t.accent : t.textMuted,
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filtered.map(g => {
          const isHighlighted = highlightTerm && g.term.toLowerCase().includes(highlightTerm);
          return (
            <div
              key={g.term}
              ref={el => termRefs.current[g.term] = el}
              style={{
                borderBottom: `1px solid ${t.border}`,
                paddingBottom: '20px',
                background: isHighlighted ? t.accentBg : 'transparent',
                borderRadius: isHighlighted ? '8px' : '0',
                padding: isHighlighted ? '16px' : '0 0 20px 0',
                transition: 'background 0.3s ease',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: '700', color: t.text, marginBottom: '6px' }}>{g.term}</div>
              <div style={{ fontSize: '14px', color: t.textSecondary, lineHeight: '1.7', marginBottom: '10px' }}>{g.definition}</div>
              {g.related && g.related.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {g.related.map(r => (
                    <span
                      key={r}
                      onClick={() => {
                        const el = Object.entries(termRefs.current).find(([k]) => k.toLowerCase() === r.toLowerCase());
                        if (el?.[1]) el[1].scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      style={{
                        background: t.accentBg,
                        border: `1px solid ${t.accentBorder}`,
                        color: t.accent,
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <div style={{ color: t.textMuted, fontSize: '14px' }}>No terms match your search.</div>}
      </div>
    </div>
  );
}

function Learn({ theme, activeSubPage, setActiveSubPage }) {
  const [glossaryHighlight, setGlossaryHighlight] = useState(null);

  const handleNavigate = (subPage, highlight) => {
    if (subPage === 'glossary' && highlight) setGlossaryHighlight(highlight);
    else setGlossaryHighlight(null);
    setActiveSubPage(subPage);
  };

  const lesson = LESSONS.find(l => l.id === activeSubPage);

  if (activeSubPage === 'quiz') return <QuizPage theme={theme} />;
  if (activeSubPage === 'glossary') return <GlossaryPage theme={theme} highlightTerm={glossaryHighlight} />;
  if (lesson) return <LessonPage lesson={lesson} theme={theme} onNavigate={handleNavigate} />;

  return (
    <div style={{ padding: '40px 32px', color: theme?.text }}>
      <p>Select a topic from the sidebar.</p>
    </div>
  );
}

export default Learn;
