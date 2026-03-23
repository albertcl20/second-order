import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { SectionCard } from '@/src/components/ui/SectionCard';

export default function MethodologyRoute() {
  return (
    <Screen scroll>
      <AppText variant="hero">Methodology</AppText>
      <AppText variant="body">
        Second Order separates what happened from why it matters, downstream implications, and uncertainty.
      </AppText>

      <SectionCard eyebrow="Ranking" title="How the feed prioritises stories">
        <AppText variant="bodySmall">
          Stories are ranked using your selected role lens, topic interests, explicit watchlist tokens, and the strongest signal profile for each story.
        </AppText>
      </SectionCard>

      <SectionCard eyebrow="Editorial standard" title="What a story needs before it belongs here">
        <AppText variant="bodySmall">
          Every entry should explain the event, the second-order implication, likely winners and losers, what to watch next, and where uncertainty still sits.
        </AppText>
      </SectionCard>
    </Screen>
  );
}
