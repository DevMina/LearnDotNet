// Builds multiple-choice questions out of content that already exists —
// every topic's keyPoints array. A question's correct answer is one of a
// topic's own keyPoints; the three wrong answers are keyPoints borrowed from
// other topics in the same scope (never the topic itself). This means the
// question bank never goes stale relative to the content and there's no
// separate quiz content to author or keep in sync — it's entirely derived.

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr, n) {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

// Builds one question about `subjectMeta`, whose content is `subjectContent`
// (already loaded). `poolMetas` is the scope to draw wrong-answer topics
// from (should exclude the subject itself). `loadTopic` loads a topic
// module by file path, same signature as manifest.js's loadTopic.
export async function buildQuestion({ subjectMeta, subjectContent, poolMetas, loadTopic, correctIndex }) {
  const otherPool = poolMetas.filter(m => m.id !== subjectMeta.id);
  if (otherPool.length < 3 || !subjectContent.keyPoints || subjectContent.keyPoints.length === 0) {
    return null; // not enough material to build a fair question
  }

  const distractorMetas = pickRandom(otherPool, 3);
  const distractorContents = await Promise.all(distractorMetas.map(m => loadTopic(m.file)));

  const idx = typeof correctIndex === 'number'
    ? correctIndex % subjectContent.keyPoints.length
    : Math.floor(Math.random() * subjectContent.keyPoints.length);
  const correctText = subjectContent.keyPoints[idx];

  const wrongTexts = distractorContents
    .filter(c => c.keyPoints && c.keyPoints.length > 0)
    .map(c => c.keyPoints[Math.floor(Math.random() * c.keyPoints.length)]);

  if (wrongTexts.length < 3) return null;

  const choices = shuffle([
    { text: correctText, correct: true },
    ...wrongTexts.slice(0, 3).map(text => ({ text, correct: false }))
  ]);

  return {
    topicId: subjectMeta.id,
    topicTitle: subjectMeta.title,
    prompt: `Which of these is true about ${subjectMeta.title}?`,
    choices
  };
}

// Builds a full quiz (default 10 questions, one subject topic per question)
// drawn from `poolMetas`. Skips any subject a fair question couldn't be
// built for (rare — only happens if the scope has fewer than 4 topics).
export async function buildQuiz({ poolMetas, loadTopic, questionCount = 10 }) {
  const subjects = pickRandom(poolMetas, Math.min(questionCount, poolMetas.length));
  const questions = [];
  for (const subjectMeta of subjects) {
    const subjectContent = await loadTopic(subjectMeta.file);
    const q = await buildQuestion({ subjectMeta, subjectContent, poolMetas, loadTopic });
    if (q) questions.push(q);
  }
  return questions;
}
