// Targeted, accurate exercise images matching specific movements
const EXERCISE_IMAGE_MAP: Record<string, string> = {
  // Lateral Raises & Shoulders
  'lateral raise': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
  'cable lateral raise': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
  'dumbbell lateral raise': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
  'shoulder': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',

  // Squat & Quads
  'squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
  'barbell squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
  'quad': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',

  // Deadlift & Posterior Chain
  'deadlift': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  'barbell deadlift': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',

  // Bench Press & Chest
  'bench press': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=600&auto=format&fit=crop&q=80',
  'barbell bench press': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=600&auto=format&fit=crop&q=80',
  'chest': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=600&auto=format&fit=crop&q=80',

  // Rows & Back Thickness
  'row': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
  'one-arm row': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
  'one arm row': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
  'dumbbell row': 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',

  // Lat Pulldown & Pullover
  'lat pulldown': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  'pulldown': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  'pullover': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',

  // Tricep Overhead & Arms
  'tricep': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  'triceps': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  'overhead tricep': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',

  // Biceps & Face Pull
  'bicep': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  'curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  'face pull': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
  'lengthened partial': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80'
};

export function getExerciseImageUrl(exerciseName: string): string {
  const nameLower = exerciseName.toLowerCase();

  for (const [key, url] of Object.entries(EXERCISE_IMAGE_MAP)) {
    if (nameLower.includes(key)) {
      return url;
    }
  }

  // Fallback gym image
  return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80';
}
