import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform
} from 'react-native';
import { Home, ClipboardList, Bot, User } from 'lucide-react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { MyReportsScreen } from './src/screens/MyReportsScreen';
import { CivicAssistantScreen } from './src/screens/CivicAssistantScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ReportFlowScreen } from './src/screens/ReportFlowScreen';
import { ReportDetailsScreen } from './src/screens/ReportDetailsScreen';
import { NearbyIssuesScreen } from './src/screens/NearbyIssuesScreen';

export default function App() {
  // Navigation tabs: 'home' | 'reports' | 'assistant' | 'profile'
  const [currentTab, setCurrentTab] = useState<'home' | 'reports' | 'assistant' | 'profile'>('home');

  // Modal / Stack Screen State
  const [activeModal, setActiveModal] = useState<
    'none' | 'report_flow' | 'report_details' | 'nearby' | 'context_assistant'
  >('none');
  const [selectedReportId, setSelectedReportId] = useState<string>('');

  const handleStartReport = () => {
    setActiveModal('report_flow');
  };

  const handleReportSuccess = (reportId: string) => {
    setSelectedReportId(reportId);
    setActiveModal('report_details');
  };

  const handleOpenAssistant = (reportId?: string) => {
    if (reportId) {
      setSelectedReportId(reportId);
      setActiveModal('context_assistant');
    } else {
      setActiveModal('none');
      setCurrentTab('assistant');
    }
  };

  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setActiveModal('report_details');
  };

  const handleViewNearby = () => {
    setActiveModal('nearby');
  };

  const handleLogout = () => {
    alert('Signed out of citizen profile.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Active Screen View */}
      <View style={styles.screenContainer}>
        {activeModal === 'report_flow' ? (
          <ReportFlowScreen
            onBack={() => setActiveModal('none')}
            onSuccess={handleReportSuccess}
          />
        ) : activeModal === 'report_details' ? (
          <ReportDetailsScreen
            reportId={selectedReportId}
            onBack={() => setActiveModal('none')}
            onOpenContextualAssistant={handleOpenAssistant}
          />
        ) : activeModal === 'context_assistant' ? (
          <CivicAssistantScreen
            initialReportId={selectedReportId}
            onBack={() => setActiveModal('none')}
          />
        ) : activeModal === 'nearby' ? (
          <NearbyIssuesScreen
            onBack={() => setActiveModal('none')}
            onSelectReport={handleViewReport}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeScreen
                onStartReport={handleStartReport}
                onOpenAssistant={handleOpenAssistant}
                onViewReport={handleViewReport}
                onViewNearby={handleViewNearby}
              />
            )}
            {currentTab === 'reports' && (
              <MyReportsScreen onSelectReport={handleViewReport} />
            )}
            {currentTab === 'assistant' && (
              <CivicAssistantScreen />
            )}
            {currentTab === 'profile' && (
              <ProfileScreen onLogout={handleLogout} />
            )}
          </>
        )}
      </View>

      {/* Citizen Bottom Navigation Bar (PRD Section 10 & 74) */}
      {activeModal === 'none' && (
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentTab('home')}
          >
            <Home
              size={22}
              color={currentTab === 'home' ? '#10b981' : '#64748b'}
            />
            <Text
              style={[
                styles.navLabel,
                currentTab === 'home' && styles.navLabelActive
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentTab('reports')}
          >
            <ClipboardList
              size={22}
              color={currentTab === 'reports' ? '#10b981' : '#64748b'}
            />
            <Text
              style={[
                styles.navLabel,
                currentTab === 'reports' && styles.navLabelActive
              ]}
            >
              Reports
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentTab('assistant')}
          >
            <Bot
              size={22}
              color={currentTab === 'assistant' ? '#10b981' : '#64748b'}
            />
            <Text
              style={[
                styles.navLabel,
                currentTab === 'assistant' && styles.navLabelActive
              ]}
            >
              Assistant
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentTab('profile')}
          >
            <User
              size={22}
              color={currentTab === 'profile' ? '#10b981' : '#64748b'}
            />
            <Text
              style={[
                styles.navLabel,
                currentTab === 'profile' && styles.navLabelActive
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090d16',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  screenContainer: {
    flex: 1
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0d1322',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b'
  },
  navLabelActive: {
    color: '#10b981',
    fontWeight: '800'
  }
});
