import type { MasteryStatus } from '../types';
import { Badge } from './ui';

const TONES: Record<MasteryStatus, 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple'> = {
  Locked: 'neutral',
  Learning: 'blue',
  Practicing: 'amber',
  Weak: 'red',
  Strong: 'green',
  Mastered: 'purple',
};

/** Small status badge for a topic/lesson mastery level. */
export default function MasteryBadge({ status }: { status: MasteryStatus }) {
  return <Badge tone={TONES[status]}>{status}</Badge>;
}
