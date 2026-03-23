import { useLocalSearchParams } from 'expo-router';
import { StoryDetailScreen } from '@/src/features/story-detail/StoryDetailScreen';
import { Screen } from '@/src/components/ui/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { rankStories } from '@/src/lib/story-intelligence';
import { useAppStore } from '@/src/store/useAppStore';
import { mockStories } from '@/src/fixtures/stories';

export function generateStaticParams() {
  return mockStories.map((story) => ({ storyId: story.id }));
}

export default function StoryRoute() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const savedStoryIds = useAppStore((state) => state.savedStoryIds);
  const watchTokens = useAppStore((state) => state.watchTokens);
  const roleFocus = useAppStore((state) => state.roleFocus);
  const interestFocus = useAppStore((state) => state.interestFocus);

  const story = rankStories({
    savedStoryIds,
    watchTokens,
    roleFocus,
    interestFocus,
  }).find((item) => item.id === storyId);

  if (!story) {
    return (
      <Screen scroll>
        <AppText variant="title">Story not found</AppText>
      </Screen>
    );
  }

  return <StoryDetailScreen story={story} />;
}
