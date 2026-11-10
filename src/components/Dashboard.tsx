import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { IncidentStatus } from '../types';
import {
  FileText,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  PlusCircle,
  Eye,
  Trash2,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  History,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { incidents, selectIncident, setActiveView, deleteIncident, loadDemoIncident } =
    useIncidents();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | IncidentStatus>('All');

  // Metrics
  const totalIncidents = incidents.length;
  const draftCount = incidents.filter((i) => i.status === 'Draft').length;
  const readyToReviewCount = incidents.filter((i) => i.status === 'Ready to Review').length;
  const readyToShareCount = incidents.filter((i) => i.status === 'Ready to Share').length;
  const totalEvidenceCount = incidents.reduce((acc, curr) => acc + curr.evidence.length, 0);

  // Filtered incidents
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || inc.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'Draft':
        return (
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Draft</span>
          </span>
        );
      case 'Analyzing':
        return (
          <span className="text-xs font-mono text-sky-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>Analyzing</span>
          </span>
        );
      case 'Ready to Review':
        return (
          <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Ready to Review</span>
          </span>
        );
      case 'Ready to Share':
        return (
          <span className="text-xs font-mono text-teal-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Ready to Share</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Incident Workspace</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage, organize, and review your private incident records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadDemoIncident}
            className="px-3 py-2 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Demo Incident</span>
          </button>
          <button
            onClick={() => setActiveView('create')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Incident</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Total Incidents</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {totalIncidents}
            </span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Across all categories</p>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Drafts</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-300 tabular-nums">
              {draftCount}
            </span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Incomplete documentation</p>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Ready to Share</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-teal-400 tabular-nums">
              {readyToShareCount}
            </span>
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Privacy check passed</p>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">Evidence Items</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {totalEvidenceCount}
            </span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Photos, notes & media</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, keyword, location, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/60"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {(['All', 'Draft', 'Ready to Review', 'Ready to Share'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === filter
                  ? 'bg-slate-800 text-teal-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
          <span>SHOWING {filteredIncidents.length} RECORD(S)</span>
          <span>SAFEFRAME IS NOT A LAW ENFORCEMENT DECISION SYSTEM</span>
        </div>

        {filteredIncidents.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl space-y-3">
            <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No incident records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no records matching your current filter. Start by creating an incident or load the sample demo incident.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveView('create')}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 rounded-lg hover:bg-teal-300"
              >
                Create Incident
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => selectIncident(incident.id, 'incident-overview')}
                className="group p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left zone: ID, Title, Metadata */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono font-semibold text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
                      {incident.id}
                    </span>
                    <span className="text-slate-400">{incident.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400">{incident.date}</span>
                    {incident.isDemo && (
                      <span className="font-mono text-amber-400/90 bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.2 rounded text-[10px]">
                        DEMO DATA
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-teal-300 transition-colors truncate">
                    {incident.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {incident.description || 'No initial summary description entered yet.'}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                    <span>{incident.location || 'Location unassigned'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{incident.evidence.length} evidence item(s)</span>
                    <span aria-hidden="true">·</span>
                    <span>{incident.timeline.length} milestone(s)</span>
                  </div>
                </div>

                {/* Right zone: Status & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-right">
                    {getStatusBadge(incident.status)}
                    <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                      Updated {new Date(incident.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectIncident(incident.id, 'incident-overview');
                      }}
                      className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Open Incident Intelligence Workspace"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectIncident(incident.id, 'what-changed');
                      }}
                      className="p-2 text-slate-400 hover:text-teal-300 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
                      title="View What Changed Intelligence"
                    >
                      <History className="w-4 h-4" />
                    </button>

                    {!incident.isDemo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete ${incident.id}?`)) {
                            deleteIncident(incident.id);
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Incident Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="text-teal-400 pl-1">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
