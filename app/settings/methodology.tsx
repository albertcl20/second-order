import { StyleSheet, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { SectionCard } from '@/src/components/ui/SectionCard';
import { colors, radius, spacing } from '@/src/theme/tokens';

const signatureSections = [
  'What happened',
  'Why it matters',
  'Who benefits',
  'Who loses',
  'What happens next',
  'What to watch',
  'Opportunity / risk',
  'Confidence / uncertainty',
];

export default function MethodologyRoute() {
  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="caption">Trust & methodology</AppText>
        <AppText variant="hero">How Second Order turns reporting into implication analysis.</AppText>
        <AppText variant="body">
          The point is not more headlines. It is a disciplined reading format that separates facts, implications, and uncertainty so users can form better judgment faster.
        </AppText>
      </View>

      <SectionCard eyebrow="Editorial format" title="Every story follows the same implication lens">
        <View style={styles.formatList}>
          {signatureSections.map((section, index) => (
            <View key={section} style={styles.formatRow}>
              <View style={styles.indexPill}>
                <AppText variant="caption" style={styles.indexText}>
                  {index + 1}
                </AppText>
              </View>
              <AppText variant="body">{section}</AppText>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard eyebrow="Separation of layers" title="Reporting comes first. Inference is labeled as inference.">
        <View style={styles.twoUp}>
          <View style={styles.layerCard}>
            <AppText variant="caption">Reporting</AppText>
            <AppText variant="bodySmall">What happened, source links, timing, and claims that can be grounded in published material.</AppText>
          </View>
          <View style={styles.layerCard}>
            <AppText variant="caption">Inference</AppText>
            <AppText variant="bodySmall">Why it matters, downstream incentives, likely winners and losers, and scenario framing about what changes next.</AppText>
          </View>
        </View>
      </SectionCard>

      <SectionCard eyebrow="Ranking" title="How Today decides what rises">
        <AppText variant="bodySmall">
          Ranking combines role lens, topic interest bias, explicit watchlist tokens, and each story’s strongest signal profile. The goal is opinionated relevance, not a generic chronology.
        </AppText>
      </SectionCard>

      <SectionCard eyebrow="Uncertainty" title="Confidence is part of the product, not a footnote">
        <AppText variant="bodySmall">
          Each briefing carries an explicit confidence label and a separate uncertainty note so the analysis can be useful without pretending to be clairvoyant.
        </AppText>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
  },
  formatList: {
    gap: spacing.sm,
  },
  formatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  indexPill: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: colors.text,
    textTransform: 'none',
    letterSpacing: 0,
  },
  twoUp: {
    gap: spacing.md,
  },
  layerCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
  },
});