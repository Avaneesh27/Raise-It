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
  ArrowLeft,
  Bot,
  MapPin,
  Calendar,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react-native';
import { mobileApi } from '../services/api';
import { IssueReport, IssueUpdate } from '../types';

interface ReportDetailsScreenProps {
  reportId: string;
  onBack: () => void;
  onOpenContextualAssistant: (reportId: string) => void;
}

export const ReportDetailsScreen: React.FC<ReportDetailsScreenProps> = ({
  reportId,
  onBack,
  onOpenContextualAssistant
}) => {
  const [report, setReport] = useState<IssueReport | null>(null);
  const [timeline, setTimeline] = useState<IssueUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await mobileApi.getReportDetails(reportId);
        setReport(res.data.report);
        setTimeline(res.data.timeline || []);
      } catch (e) {
        console.warn('Details fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [reportId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Fetching complaint details...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Complaint not found.</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backIconBtn}>
          <ArrowLeft size={20} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Ticket #{report.reportId}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Photographic Evidence View (PRD Section 29) */}
        <View style={styles.evidenceCard}>
          <Image source={{ uri: report.imageUrl }} style={styles.evidenceImage} />
          <View style={styles.evidenceOverlayBadge}>
            <Text style={styles.overlayStatus}>{report.status}</Text>
          </View>
        </View>

        {/* Primary Meta & Priority Card */}
        <View style={styles.metaCard}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryName}>
              {report.categoryName.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={[
              styles.priorityBadge,
              report.priorityLevel === 'HIGH' ? styles.prioHigh : styles.prioMed
            ]}>
              {report.priorityLevel} PRIORITY ({report.priorityScore}/100)
            </Text>
          </View>

          {/* AI Confidence Transparency (PRD Section 20) */}
          <View style={styles.aiBadgeRow}>
            <Sparkles size={14} color="#10b981" />
            <Text style={styles.aiConfidenceText}>
              AI Confidence: {Math.round(report.aiConfidence * 100)}%
            </Text>
            {report.isCategoryOverridden && (
              <Text style={styles.overriddenTag}>Overridden by citizen</Text>
            )}
          </View>

          {/* Recurrence Status (PRD Section 22) */}
          {report.isRecurring && (
            <View style={styles.recurringAlert}>
              <Flame size={16} color="#f43f5e" />
              <Text style={styles.recurringAlertText}>
                Recurring Hotspot: {report.nearbyReportCount} similar reports nearby
              </Text>
            </View>
          )}

          {/* Location & Address */}
          <View style={styles.locationSection}>
            <MapPin size={15} color="#38bdf8" />
            <Text style={styles.addressText}>{report.address || 'Reported Location'}</Text>
          </View>

          {report.description ? (
            <Text style={styles.descText}>{report.description}</Text>
          ) : null}
        </View>

        {/* Contextual Civic Assistant Action (PRD Section 29 & 37) */}
        <TouchableOpacity
          style={styles.contextAssistantButton}
          onPress={() => onOpenContextualAssistant(report.reportId)}
          activeOpacity={0.88}
        >
          <View style={styles.assistantIconCircle}>
            <Bot size={22} color="#10b981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.assistantBtnTitle}>Ask About This Complaint</Text>
            <Text style={styles.assistantBtnSub}>
              "What happens next?" • "What is the official repair timeline?"
            </Text>
          </View>
        </TouchableOpacity>

        {/* Resolution Notes If Resolved */}
        {report.status === 'RESOLVED' && (
          <View style={styles.resolutionCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={18} color="#10b981" />
              <Text style={styles.resolutionTitle}>Resolution Proof & Notes</Text>
            </View>
            <Text style={styles.resolutionNotesText}>
              {report.resolutionNotes || 'Repair verified and completed by authorized field crew.'}
            </Text>
            {report.resolutionImageUrl && (
              <Image source={{ uri: report.resolutionImageUrl }} style={styles.resolutionImg} />
            )}
          </View>
        )}

        {/* Chronological Complaint Timeline (PRD Section 30) */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Official Resolution Timeline</Text>

          <View style={styles.timelineList}>
            {timeline.map((item, index) => (
              <View key={item._id || index} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineStatus}>{item.status}</Text>
                    <Text style={styles.timelineDate}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.timelineComment}>{item.comment}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16'
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#090d16',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 13
  },
  errorText: {
    color: '#f43f5e',
    fontSize: 14,
    fontWeight: '700'
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#131b2e',
    borderRadius: 12
  },
  backButtonText: {
    color: '#10b981',
    fontWeight: '700'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  backIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#131b2e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topBarTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc'
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  evidenceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#131b2e',
    borderWidth: 1,
    borderColor: '#1e293b',
    height: 240,
    position: 'relative',
    marginBottom: 16
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  evidenceOverlayBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  overlayStatus: {
    color: '#10b981',
    fontWeight: '800',
    fontSize: 11
  },
  metaCard: {
    backgroundColor: '#131b2e',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#f8fafc'
  },
  priorityBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  prioHigh: {
    backgroundColor: '#f43f5e22',
    color: '#f43f5e'
  },
  prioMed: {
    backgroundColor: '#f59e0b22',
    color: '#f59e0b'
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12
  },
  aiConfidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981'
  },
  overriddenTag: {
    fontSize: 10,
    color: '#f59e0b',
    backgroundColor: '#f59e0b1a',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  recurringAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f43f5e1a',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f43f5e33'
  },
  recurringAlertText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f43f5e',
    flex: 1
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10
  },
  addressText: {
    fontSize: 12,
    color: '#94a3b8'
  },
  descText: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
    backgroundColor: '#090d16',
    padding: 12,
    borderRadius: 12,
    marginTop: 4
  },
  contextAssistantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10b98144',
    marginBottom: 16
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
  assistantBtnTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff'
  },
  assistantBtnSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2
  },
  resolutionCard: {
    backgroundColor: '#10b98110',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#10b98133',
    marginBottom: 16
  },
  resolutionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10b981'
  },
  resolutionNotesText: {
    fontSize: 12,
    color: '#e2e8f0',
    marginTop: 6,
    lineHeight: 18
  },
  resolutionImg: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginTop: 10
  },
  timelineCard: {
    backgroundColor: '#131b2e',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 16
  },
  timelineList: {
    paddingLeft: 8
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    marginTop: 4,
    marginRight: 12
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#090d16',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  timelineStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10b981'
  },
  timelineDate: {
    fontSize: 10,
    color: '#64748b'
  },
  timelineComment: {
    fontSize: 11,
    color: '#cbd5e1'
  }
});
