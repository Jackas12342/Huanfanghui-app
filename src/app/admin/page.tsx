"use client";

import { useState } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import {
  adminUpdateVerification,
  loadListings,
  loadReports,
  loadVerificationSubmissions,
  setListingTakedown,
  type Listing,
  type UserReport,
  type VerificationSubmission,
} from "@/lib/mvp";

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<VerificationSubmission[]>(() => loadVerificationSubmissions());
  const [listings, setListings] = useState<Listing[]>(() => loadListings());
  const [reports, setReports] = useState<UserReport[]>(() => loadReports());

  const refresh = () => {
    setSubmissions(loadVerificationSubmissions());
    setListings(loadListings());
    setReports(loadReports());
  };

  return (
    <AppFrame eyebrow="ADMIN OPERATIONS" title="审核与风控最小工作台">
      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2>资产认证审核队列</h2>
          {submissions.length === 0 ? <p>暂无提交</p> : null}
          {submissions.map((submission) => (
            <div key={submission.id} className="form-actions">
              <span>
                {submission.docType} · {submission.fileName} · {submission.status}
              </span>
              <button
                className="button button-primary"
                onClick={() => {
                  adminUpdateVerification(submission.id, "approved");
                  refresh();
                }}
              >
                通过
              </button>
              <button
                className="button button-ghost"
                onClick={() => {
                  adminUpdateVerification(submission.id, "rejected");
                  refresh();
                }}
              >
                驳回
              </button>
            </div>
          ))}
        </section>

        <section className="dashboard-card">
          <h2>房源管理（下架/恢复）</h2>
          {listings.map((listing) => (
            <div key={listing.id} className="form-actions">
              <span>
                {listing.current.compound} · {listing.current.area}㎡ · {listing.status}
              </span>
              <button
                className="button button-ghost"
                onClick={() => {
                  setListingTakedown(listing.id);
                  refresh();
                }}
              >
                {listing.status === "takedown" ? "恢复" : "下架"}
              </button>
            </div>
          ))}
        </section>
      </div>

      <section className="dashboard-card" style={{ marginTop: 20 }}>
        <h2>举报记录</h2>
        {reports.length === 0 ? <p>暂无举报</p> : null}
        {reports.map((report) => (
          <p key={report.id}>
            线程 {report.threadId}：{report.reason}
          </p>
        ))}
      </section>
    </AppFrame>
  );
}
