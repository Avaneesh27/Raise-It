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
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  Bot,
  MapPin,
  Flame,
  ChevronRight,
  Bell,
  Sparkles
} from 'lucide-react-native';
import { mobileApi } from '../services/api';
import { IssueReport } from '../types';

interface HomeScreenProps {
  onStartReport: () => void;
  onOpenAssistant: (reportId?: string) => void;
  onViewReport: (reportId: string) => void;
  onViewNearby: () => void;
  userName?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartReport,
  onOpenAssistant,
  onViewReport,
  onViewNearby,
  userName = 'Citizen'
}) => {
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0 });
  const [recentReports, setRecentReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await mobileApi.getDashboard();
      if (res.data?.stats) setStats(res.data.stats);
      if (res.data?.recentReports) setRecentReports(res.data.recentReports);
    } catch (e) {
      console.warn('Dashboard note:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingSub}>Welcome back,</Text>
          <Text style={styles.greetingTitle}>{userName}</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Bell size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Prominent Primary Call-to-Action: REPORT AN ISSUE (PRD Section 15 & 73) */}
      <TouchableOpacity
        style={styles.primaryReportButton}
        onPress={onStartReport}
        activeOpacity={0.88}
      >
        <View style={styles.primaryReportInner}>
          <View style={styles.reportIconCircle}>
            <PlusCircle size={28} color="#ffffff" />
          </View>
          <View style={styles.reportTextContainer}>
            <Text style={styles.reportButtonTitle}>REPORT AN ISSUE</Text>
            <Text style={styles.reportButtonSub}>
              Snap photo • AI identifies issue • Auto-routed to authority
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Complaint Status Summary Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: '#f59e0b33' }]}>
          <View style={styles.statIconBadgeAmber}>
            <Clock size={16} color="#f59e0b" />
          </View>
          <Text style={styles.statValue}>{loading ? '-' : stats.active}</Text>
          <Text style={styles.statLabel}>Active Reports</Text>
        </View>

        <View style={[styles.statCard, { borderColor: '#10b98133' }]}>
          <View style={styles.statIconBadgeGreen}>
            <CheckCircle2 size={16} color="#10b981" />
          </View>
          <Text style={styles.statValue}>{loading ? '-' : stats.resolved}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      {/* Quick Action: Ask Civic Assistant (RAG) */}
      <TouchableOpacity
        style={styles.assistantBanner}
        onPress={() => onOpenAssistant()}
        activeOpacity={0.88}
      >
        <View style={styles.assistantIconCircle}>
          <Bot size={22} color="#10b981" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.assistantBadgeRow}>
            <Text style={styles.assistantTitle}>Civic Assistant</Text>
            <View style={styles.groundedPill}>
              <Sparkles size={10} color="#10b981" />
              <Text style={styles.groundedPillText}>RAG Verified</Text>
            </View>
          </View>
          <Text style={styles.assistantSub}>
            Ask about municipal procedures, complaint SLAs, or regulations
          </Text>
        </View>
        <ChevronRight size={18} color="#64748b" />
      </TouchableOpacity>

      {/* Nearby Issues Quick Access */}
      <TouchableOpacity
        style={styles.nearbyBanner}
        onPress={onViewNearby}
        activeOpacity={0.88}
      >
        <View style={styles.nearbyIconCircle}>
          <MapPin size={20} color="#38bdf8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nearbyTitle}>Nearby Civic Issues</Text>
          <Text style={styles.nearbySub}>
            Inspect potholes, leaks, and blackspots reported around your GPS
          </Text>
        </View>
        <ChevronRight size={18} color="#64748b" />
      </TouchableOpacity>

      {/* Recent Updates Section */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Updates</Text>

        {loading ? (
          <ActivityIndicator color="#10b981" style={{ marginVertical: 20 }} />
        ) : recentReports.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>You haven't submitted any civic issues yet.</Text>
            <Text style={styles.emptySub}>Tap "Report an Issue" above to begin.</Text>
          </View>
        ) : (
          recentReports.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.reportCard}
              onPress={() => onViewReport(item.reportId)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.cardImage}
              />
              <View style={styles.cardDetails}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardId}>#{item.reportId}</Text>
                  <Text style={[
                    styles.statusPill,
                    item.status === 'RESOLVED' ? styles.statusResolved : styles.statusActive
                  ]}>
                    {item.status}
                  </Text>
                </View>
                <Text style={styles.cardCategory}>
                  {item.categoryName.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={styles.cardAddress} numberOfLines={1}>
                  {item.address || 'Reported Location'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16'
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  greetingSub: {
    fontSize: 13,
    color: '#94a3b8'
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc'
  },
  notifButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#131b2e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  primaryReportButton: {
    backgroundColor: '#059669',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8
  },
  primaryReportInner: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reportIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  reportTextContainer: {
    flex: 1
  },
  reportButtonTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5
  },
  reportButtonSub: {
    fontSize: 12,
    color: '#d1fae5',
    marginTop: 3,
    lineHeight: 16
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18
  },
  statCard: {
    flex: 1,
    backgroundColor: '#131b2e',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1
  },
  statIconBadgeAmber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f59e0b1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  statIconBadgeGreen: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#10b9811a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc'
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2
  },
  assistantBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12
  },
  assistantIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#10b9811a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  assistantBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2
  },
  assistantTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc'
  },
  groundedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b9811a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  groundedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981'
  },
  assistantSub: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 15
  },
  nearbyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 24
  },
  nearbyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#38bdf81a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  nearbyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc'
  },
  nearbySub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2
  },
  recentSection: {
    marginTop: 4
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12
  },
  emptyCard: {
    backgroundColor: '#131b2e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500'
  },
  emptySub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4
  },
  reportCard: {
    flexDirection: 'row',
    backgroundColor: '#131b2e',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10,
    alignItems: 'center'
  },
  cardImage: {
    width: 60,
    height: 60,
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
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#10b981'
  },
  statusPill: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  statusActive: {
    backgroundColor: '#f59e0b22',
    color: '#f59e0b'
  },
  statusResolved: {
    backgroundColor: '#10b98122',
    color: '#10b981'
  },
  cardCategory: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 2
  },
  cardAddress: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2
  }
});
