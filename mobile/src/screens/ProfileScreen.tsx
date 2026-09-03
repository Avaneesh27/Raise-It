import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { User, Shield, Bell, FileText, LogOut, ChevronRight } from 'lucide-react-native';

interface ProfileScreenProps {
  user?: any;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onLogout
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Citizen Profile</Text>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>
            {user?.name?.charAt(0) || 'A'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{user?.name || 'Avaneesh (Citizen)'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'citizen@example.com'}</Text>
          <View style={styles.roleBadge}>
            <Shield size={10} color="#10b981" />
            <Text style={styles.roleBadgeText}>VERIFIED CITIZEN</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuCard}>
        <TouchableOpacity style={styles.menuRow}>
          <View style={styles.menuIconCircle}>
            <Bell size={18} color="#38bdf8" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuLabel}>Notification Alerts</Text>
            <Text style={styles.menuSub}>In-app status progression updates</Text>
          </View>
          <ChevronRight size={16} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow}>
          <View style={styles.menuIconCircle}>
            <FileText size={18} color="#a855f7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuLabel}>Citizen Grievance Charter</Text>
            <Text style={styles.menuSub}>Official municipal service level guarantees</Text>
          </View>
          <ChevronRight size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <LogOut size={16} color="#f43f5e" />
        <Text style={styles.logoutText}>Sign Out of RaiseIt</Text>
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 20
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131b2e',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 20
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#10b9811a',
    borderWidth: 1,
    borderColor: '#10b98144',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '900',
    color: '#10b981'
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc'
  },
  userEmail: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b9811a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10b981'
  },
  menuCard: {
    backgroundColor: '#131b2e',
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 20
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#090d16',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc'
  },
  menuSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f43f5e1a',
    borderWidth: 1,
    borderColor: '#f43f5e33',
    borderRadius: 18,
    paddingVertical: 14
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f43f5e'
  }
});
