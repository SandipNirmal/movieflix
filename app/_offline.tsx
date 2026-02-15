import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { View, useColorScheme } from 'react-native';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { WifiOffIcon } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export function useIsOffline() {
  const netInfo = useNetInfo();
  // netInfo.isConnected is null initially while loading — treat as online
  return netInfo.isConnected === false;
}

export default function OfflineScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View className="bg-background flex-1 items-center justify-center px-6">
      <View className="bg-muted mb-6 rounded-full p-6">
        <WifiOffIcon size={48} color={colors.textSecondary} />
      </View>
      <Text variant="h3" className="mb-2 text-center">
        No Internet Connection
      </Text>
      <Text variant="muted" className="mb-8 text-center">
        Please check your network settings and try again.
      </Text>
      <Button variant="outline" className="min-w-40" onPress={() => NetInfo.refresh()}>
        <Text>Try Again</Text>
      </Button>
    </View>
  );
}
