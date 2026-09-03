import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl
} from 'react-native';
import { Flame, Clock, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { mobileApi } from '../services/api';
import { IssueReport } from '../types';

interface MyReportsScreenProps {
  onSelectReport: (reportId: string) => void;
}

export const MyReportsScreen: React.FC<MyReportsScreenProps> = ({ onSelectReport }) => {
  const [tab, setTab] = useState<'active' | 'resolved'>('active');
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await mobileApi.getMyReports(tab);
      setReports(res.data.reports || []);
    } catch (e) {
      console.warn('Error fetching reports', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [tab]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Civic Grievances</Text>
        <Text style={styles.headerSub}>Track the resolution lifecycle of issues you reported</Text>

        {/* Segmented Control: Active vs Resolved (PRD Section 28) */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, tab === 'active' && styles.segmentBtnActive]}
            onPress={() => setTab('active')}
          >
            <Clock size={14} color={tab === 'active' ? '#ffffff' : '#94a3b8'} />
            <Text style={[styles.segmentBtnText, tab === 'active' && styles.segmentBtnTextActive]}>
              Active Complaints
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, tab === 'resolved' && styles.segmentBtnActive]}
            onPress={() => setTab('resolved')}
          >
            <CheckCircle2 size={14} color={tab === 'resolved' ? '#ffffff' : '#94a3b8'} />
            <Text style={[styles.segmentBtnText, tab === 'resolved' && styles.segmentBtnTextActive]}>
              Resolved Archive
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reports List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
      >
        {loading ? (
          <ActivityIndicator color="#10b981" style={{ marginTop: 40 }} />
        ) : reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {tab === 'active' ? 'No active civic complaints.' : 'No resolved reports in your archive.'}
            </Text>
            <Text style={styles.emptySub}>
              {tab === 'active'
                ? 'When you submit issues, you can track real-time progress here.'
                : 'Resolved complaints will appear here with proof photos and completion notes.'}
            </Text>
          </View>
        ) : (
          reports.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              onPress={() => onSelectReport(item.reportId)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.cardThumb} />

              <View style={styles.cardBody}>
                <View style={styles.cardRow}>
                  <Text style={styles.reportId}>#{item.reportId}</Text>
                  <View style={styles.tagRow}>
                    {item.isRecurring && (
                      <View style={styles.recurringTag}>
                        <Flame size={10} color="#f43f5e" />
                        <Text style={styles.recurringTagText}>Hotspot</Text>
                      </View>
                    )}
                    <Text style={[
                      styles.priorityTag,
                      item.priorityLevel === 'HIGH' ? styles.prioHigh : styles.prioMed
                    ]}>
                      {item.priorityLevel}
                    </Text>
                  </View>
                </View>

                <Text style={styles.categoryTitle}>
                  {item.categoryName.replace('_', ' ').toUpperCase()}
                </Text>

                <Text style={styles.addressText} numberOfLines={1}>
                  {item.address || 'Reported coordinate'}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.statusText}>{item.status}</Text>
                  <Text style={styles.dateText}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <ChevronRight size={16} color="#64748b" style={{ marginLeft: 8 }} />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc'
  },
  headerSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#131b2e',
    borderRadius: 14,
    padding: 4,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10
  },
  segmentBtnActive: {
    backgroundColor: '#059669'
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8'
  },
  segmentBtnTextActive: {
    color: '#ffffff'
  },
  listContent: {
    padding: 20,
    paddingBottom: 40
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12
  },
  cardThumb: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#090d16'
  },
  cardBody: {
    flex: 1,
    marginLeft: 12
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reportId: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#10b981'
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6
  },
  recurringTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#f43f5e1a',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  recurringTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#f43f5e'
  },
  priorityTag: {
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  prioHigh: {
    backgroundColor: '#f43f5e22',
    color: '#f43f5e'
  },
  prioMed: {
    backgroundColor: '#f59e0b22',
    color: '#f59e0b'
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 2
  },
  addressText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38bdf8'
  },
  dateText: {
    fontSize: 10,
    color: '#64748b'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8'
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30
  }
});
