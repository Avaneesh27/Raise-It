import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Bot, Send, Sparkles, FileText, ArrowLeft } from 'lucide-react-native';
import { mobileApi } from '../services/api';
import { RAGSource } from '../types';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  sources?: RAGSource[];
}

interface CivicAssistantScreenProps {
  initialReportId?: string;
  onBack?: () => void;
}

export const CivicAssistantScreen: React.FC<CivicAssistantScreenProps> = ({
  initialReportId,
  onBack
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: initialReportId
        ? `Hello! I am your RAG Civic Assistant linked to Report #${initialReportId}. You can ask about escalation steps, standard repair times, or municipal department procedures.`
        : 'Hello! I am your verified Civic Assistant. Ask me anything about municipal regulations, complaint stages, or department responsibilities.'
    }
  ]);

  const handleSend = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setQuestion('');
    setLoading(true);

    try {
      const res = await mobileApi.queryRAG(q, initialReportId);
      const assistantMsg: Message = {
        sender: 'assistant',
        text: res.data.answer,
        sources: res.data.sources
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to connect to the Civic Knowledge Base. Please check server connectivity.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft size={18} color="#f8fafc" />
          </TouchableOpacity>
        )}
        <View style={styles.headerTitleRow}>
          <View style={styles.botIcon}>
            <Bot size={20} color="#10b981" />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.headerTitle}>Civic Assistant</Text>
              <View style={styles.ragBadge}>
                <Sparkles size={10} color="#10b981" />
                <Text style={styles.ragBadgeText}>RAG Grounded</Text>
              </View>
            </View>
            <Text style={styles.headerSub}>
              {initialReportId ? `Context: Report #${initialReportId}` : 'Verified Municipal Knowledge Base'}
            </Text>
          </View>
        </View>
      </View>

      {/* Suggested Quick Questions */}
      <View style={styles.suggestionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => handleSend('What happens after submitting a complaint?')}
          >
            <Text style={styles.suggestionChipText}>What happens next?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => handleSend('What is the repair timeline SLA for potholes?')}
          >
            <Text style={styles.suggestionChipText}>Pothole repair SLA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => handleSend('Which department handles streetlights?')}
          >
            <Text style={styles.suggestionChipText}>Streetlight jurisdiction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => handleSend('What is the escalation procedure if an issue is delayed?')}
          >
            <Text style={styles.suggestionChipText}>Escalation process</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView contentContainerStyle={styles.messagesContent}>
        {messages.map((m, idx) => (
          <View
            key={idx}
            style={[
              styles.messageBubble,
              m.sender === 'user' ? styles.userBubble : styles.assistantBubble
            ]}
          >
            <Text style={[styles.messageText, m.sender === 'user' && { color: '#ffffff' }]}>
              {m.text}
            </Text>

            {/* Sources List (PRD Section 38 & 39) */}
            {m.sources && m.sources.length > 0 && (
              <View style={styles.sourcesContainer}>
                <View style={styles.sourcesHeader}>
                  <FileText size={12} color="#10b981" />
                  <Text style={styles.sourcesHeaderText}>Verified Sources:</Text>
                </View>
                {m.sources.map((s, sIdx) => (
                  <View key={sIdx} style={styles.sourceItem}>
                    <Text style={styles.sourceDoc}>{s.documentName}</Text>
                    <Text style={styles.sourcePage}>{s.pageOrSection}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View style={[styles.messageBubble, styles.assistantBubble, { flexDirection: 'row', gap: 8, alignItems: 'center' }]}>
            <ActivityIndicator size="small" color="#10b981" />
            <Text style={styles.loadingText}>Retrieving verified civic SOPs...</Text>
          </View>
        )}
      </ScrollView>

      {/* Message Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Ask about municipal guidelines, SOPs, or timelines..."
          placeholderTextColor="#64748b"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => handleSend()}
          disabled={loading || !question.trim()}
          style={[styles.sendButton, (!question.trim() || loading) && { opacity: 0.5 }]}
        >
          <Send size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    marginRight: 12
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#10b9811a',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc'
  },
  ragBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10b9811a',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6
  },
  ragBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#10b981'
  },
  headerSub: {
    fontSize: 11,
    color: '#94a3b8'
  },
  suggestionsContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  suggestionChip: {
    backgroundColor: '#131b2e',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  suggestionChipText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600'
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 12
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 18,
    padding: 14
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#059669',
    borderBottomRightRadius: 4
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#131b2e',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderBottomLeftRadius: 4
  },
  messageText: {
    fontSize: 13,
    color: '#e2e8f0',
    lineHeight: 18
  },
  loadingText: {
    fontSize: 12,
    color: '#94a3b8'
  },
  sourcesContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b'
  },
  sourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4
  },
  sourcesHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981'
  },
  sourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#090d16',
    padding: 6,
    borderRadius: 8,
    marginTop: 3
  },
  sourceDoc: {
    fontSize: 10,
    fontWeight: '600',
    color: '#cbd5e1'
  },
  sourcePage: {
    fontSize: 10,
    color: '#64748b'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    backgroundColor: '#090d16',
    gap: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#131b2e',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
