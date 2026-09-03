import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
import { MapPin, Flame, ArrowLeft, RefreshCw, Layers } from 'lucide-react-native';
import { mobileApi } from '../services/api';

interface NearbyIssuesScreenProps {
  onBack: () => void;
  onSelectReport?: (reportId: string) => void;
}

export const NearbyIssuesScreen: React.FC<NearbyIssuesScreenProps> = ({
  onBack,
  onSelectReport
}) => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNearby = async () => {
    setLoading(true);
    try {
      // Default to city center coordinates
      const res = await mobileApi.getNearbyReports(77.5946, 12.9716, 5000);
      setIssues(res.data.reports || []);
    } catch (e) {
      console.warn('Nearby fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={18} color="#f8fafc" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Nearby Civic Issues</Text>
          <Text style={styles.headerSub}>Issues reported within your municipal zone</Text>
        </View>
        <TouchableOpacity onPress={fetchNearby} style={styles.refreshBtn}>
          <RefreshCw size={16} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {loading ? (
          <ActivityIndicator color="#10b981" style={{ marginTop: 40 }} />
        ) : issues.length === 0 ? (
          <View style={styles.emptyCard}>
            <MapPin size={40} color="#64748b" />
            <Text style={styles.emptyTitle}>No Nearby Reports Found</Text>
            <Text style={styles.emptySub}>Your immediate area has no active civic complaints recorded.</Text>
          </View>
        ) : (
          issues.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              onPress={() => onSelectReport?.(item.reportId)}
              activeOpacity={0.88}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

              <View style={styles.cardDetails}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardId}>#{item.reportId}</Text>
                  {item.isRecurring && (
                    <View style={styles.hotspotBadge}>
                      <Flame size={10} color="#f43f5e" />
                      <Text style={styles.hotspotText}>Cluster ({item.nearbyReportCount})</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.categoryName}>
                  {item.categoryName.replace('_', ' ').toUpperCase()}
                </Text>

                <Text style={styles.addressText} numberOfLines={1}>
                  {item.address}
                </Text>

                <View style={styles.cardBottomRow}>
                  <Text style={styles.priorityText}>{item.priorityLevel} PRIORITY</Text>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#131b2e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc'
  },
  headerSub: {
    fontSize: 11,
    color: '#94a3b8'
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#131b2e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listContent: {
    padding: 16,
    paddingBottom: 40
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8'
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#131b2e',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#090d16',
    marginRight: 12
  },
  cardDetails: {
    flex: 1
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardId: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#10b981'
  },
  hotspotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#f43f5e1a',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  hotspotText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#f43f5e'
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 2
  },
  addressText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#f59e0b'
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38bdf8'
  }
});
