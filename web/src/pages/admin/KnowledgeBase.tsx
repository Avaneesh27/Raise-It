import React, { useEffect, useState } from 'react';
import { BookOpen, Upload, RefreshCw, CheckCircle2, FileText, Bot, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/api';
import { CivicDocument } from '../../types';

export const KnowledgeBase: React.FC = () => {
  const [documents, setDocuments] = useState<CivicDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [docType, setDocType] = useState('Guidelines');
  const [version, setVersion] = useState('1.0');
  const [uploading, setUploading] = useState(false);
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDocuments();
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error('Error loading documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name || file.name);
      formData.append('documentType', docType);
      formData.append('version', version);

      await adminApi.uploadDocument(formData);
      setFile(null);
      setName('');
      await fetchDocs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleReindex = async (id: string) => {
    setReindexingId(id);
    try {
      await adminApi.triggerDocumentIndex(id);
      await fetchDocs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Re-indexing failed');
    } finally {
      setReindexingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Civic Knowledge Base (RAG)</h2>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
              ChromaDB Vector Store
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Verified municipal SOPs, citizen charters, and department regulations grounding the Civic Assistant (PRD Section 57)
          </p>
        </div>

        <button
          onClick={fetchDocs}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Store</span>
        </button>
      </div>

      {/* Upload New Document Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Upload className="w-4 h-4 text-emerald-400" />
          <span>Ingest Verified Civic Document</span>
        </h3>

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Document Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Road Repair SOP"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="SOP">Standard Operating Procedure (SOP)</option>
              <option value="Policy">Municipal Policy</option>
              <option value="Charter">Citizen Charter</option>
              <option value="Guidelines">Department Guidelines</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Select Markdown / PDF</label>
            <input
              type="file"
              accept=".md,.txt,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition shadow-lg shadow-emerald-600/20"
            >
              {uploading ? 'Extracting & Indexing...' : 'Upload & Vector Index'}
            </button>
          </div>
        </form>
      </div>

      {/* Indexed Documents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Document Title</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Indexed Chunks</th>
              <th className="py-3.5 px-4">Index Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {documents.map((d) => (
              <tr key={d._id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 font-bold text-slate-200 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>{d.name}</span>
                </td>
                <td className="py-3 px-4 text-slate-400">{d.documentType} v{d.version}</td>
                <td className="py-3 px-4 font-mono text-emerald-400">{d.chunkCount || 8} chunks</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      d.status === 'INDEXED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : d.status === 'PROCESSING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleReindex(d._id)}
                    disabled={reindexingId === d._id}
                    className="inline-flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg text-xs transition"
                  >
                    <RefreshCw className={`w-3 h-3 ${reindexingId === d._id ? 'animate-spin' : ''}`} />
                    <span>Re-Index</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
