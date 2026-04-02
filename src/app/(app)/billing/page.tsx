"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useCreditsStore } from "@/stores/credits-store";
import { useHydration } from "@/hooks/use-hydration";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins, CreditCard, ArrowUpRight, Pencil, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function BillingPage() {
  const { user } = useAuthStore();
  const { balance, used, limit } = useCreditsStore();
  const hydrated = useHydration();
  const [editOpen, setEditOpen] = useState(false);
  const [savedCard, setSavedCard] = useState({ number: "4242", name: "", expiry: "12/27" });
  const [formCard, setFormCard] = useState("");
  const [formName, setFormName] = useState("");
  const [formExpiry, setFormExpiry] = useState("");
  const [formCvv, setFormCvv] = useState("");
  const [cardErr, setCardErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [expiryErr, setExpiryErr] = useState("");
  const [cvvErr, setCvvErr] = useState("");

  if (!hydrated) {
    return <div className="glass-card h-96 animate-pulse" />;
  }

  const usagePercent = limit > 0 ? (used / limit) * 100 : 0;
  const maskedCard = `•••• •••• •••• ${savedCard.number.slice(-4)}`;

  const validateCard = (v: string) => {
    const digits = v.replace(/\s/g, "");
    if (!digits) { setCardErr("Card number is required"); return false; }
    if (!/^\d+$/.test(digits)) { setCardErr("Only numbers allowed"); return false; }
    if (digits.length < 13 || digits.length > 19) { setCardErr("Card number must be 13-19 digits"); return false; }
    setCardErr(""); return true;
  };

  const validateName = (v: string) => {
    if (!v.trim()) { setNameErr("Cardholder name is required"); return false; }
    if (/[0-9]/.test(v)) { setNameErr("Numbers are not allowed"); return false; }
    if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) { setNameErr("Only letters allowed"); return false; }
    setNameErr(""); return true;
  };

  const validateExpiry = (v: string) => {
    if (!v.trim()) { setExpiryErr("Expiry date is required"); return false; }
    if (!/^\d{2}\/\d{2}$/.test(v.trim())) { setExpiryErr("Format must be MM/YY"); return false; }
    const [mm] = v.split("/").map(Number);
    if (mm < 1 || mm > 12) { setExpiryErr("Month must be 01-12"); return false; }
    setExpiryErr(""); return true;
  };

  const validateCvv = (v: string) => {
    if (!v) { setCvvErr("CVV is required"); return false; }
    if (!/^\d+$/.test(v)) { setCvvErr("Only numbers allowed"); return false; }
    if (v.length < 3 || v.length > 4) { setCvvErr("CVV must be 3-4 digits"); return false; }
    setCvvErr(""); return true;
  };

  const openEdit = () => {
    setFormCard(""); setFormName(savedCard.name); setFormExpiry(savedCard.expiry); setFormCvv("");
    setCardErr(""); setNameErr(""); setExpiryErr(""); setCvvErr("");
    setEditOpen(true);
  };

  const handleSavePayment = () => {
    const c = validateCard(formCard);
    const n = validateName(formName);
    const e = validateExpiry(formExpiry);
    const v = validateCvv(formCvv);
    if (!c || !n || !e || !v) return;
    setSavedCard({ number: formCard.replace(/\s/g, ""), name: formName.trim(), expiry: formExpiry.trim() });
    toast.success("Payment method updated");
    setEditOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription and credits.</p>
      </div>

      {/* Current Plan + Payment Method - side by side */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Current Plan */}
        <div className="flex-1 glass-card p-6 gradient-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-foreground">Current Plan</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="gradient-bg text-foreground border-0 capitalize">
                  {user?.plan ?? "free"}
                </Badge>
              </div>
            </div>
            <Button render={<Link href="/pricing" />} variant="outline" className="bg-muted border-border hover:bg-accent gap-1.5">
              Upgrade
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Separator className="bg-border my-4" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Credits Used
              </span>
              <span className="text-sm text-foreground font-mono">{used} / {limit}</span>
            </div>
            <Progress value={usagePercent} className="h-2 bg-muted" />
            <p className="text-xs text-muted-foreground">
              {balance} credits remaining this month. Resets on the 1st.
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex-1 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Payment Method</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={openEdit}
              className="bg-muted border-border hover:bg-accent gap-1.5"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-foreground font-mono">{maskedCard}</p>
              <p className="text-xs text-muted-foreground">Expires {savedCard.expiry} · CVV •••</p>
            </div>
          </div>
          {savedCard.name && (
            <p className="text-xs text-muted-foreground mt-2">Cardholder: {savedCard.name}</p>
          )}
        </div>
      </div>

      {/* Recent Usage - full width row */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Recent Usage</h2>
        <div className="divide-y divide-border">
          {[
            { project: "Summer Sale Campaign", credits: 60, date: "Mar 15" },
            { project: "Fitness App Launch", credits: 45, date: "Mar 28" },
            { project: "Welcome Credits", credits: -500, date: "Mar 1" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-foreground">{item.project}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <span className={`text-sm font-mono ${item.credits < 0 ? "text-brand-teal" : "text-muted-foreground"}`}>
                {item.credits > 0 ? `-${item.credits}` : `+${Math.abs(item.credits)}`} credits
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Payment Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md bg-popover border-border">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Card Number</Label>
              <Input
                value={formCard}
                onChange={(e) => { setFormCard(e.target.value); validateCard(e.target.value); }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`bg-muted ${cardErr ? "border-red-500 focus:border-red-500" : "border-border"}`}
              />
              {cardErr && <p className="text-xs text-red-400">{cardErr}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Cardholder Name</Label>
              <Input
                value={formName}
                onChange={(e) => { setFormName(e.target.value); validateName(e.target.value); }}
                placeholder="John Doe"
                className={`bg-muted ${nameErr ? "border-red-500 focus:border-red-500" : "border-border"}`}
              />
              {nameErr && <p className="text-xs text-red-400">{nameErr}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Expiry Date</Label>
                <Input
                  value={formExpiry}
                  onChange={(e) => { setFormExpiry(e.target.value); validateExpiry(e.target.value); }}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`bg-muted ${expiryErr ? "border-red-500 focus:border-red-500" : "border-border"}`}
                />
                {expiryErr && <p className="text-xs text-red-400">{expiryErr}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>CVV</Label>
                <Input
                  type="password"
                  value={formCvv}
                  onChange={(e) => { setFormCvv(e.target.value); validateCvv(e.target.value); }}
                  placeholder="•••"
                  maxLength={4}
                  className={`bg-muted ${cvvErr ? "border-red-500 focus:border-red-500" : "border-border"}`}
                />
                {cvvErr && <p className="text-xs text-red-400">{cvvErr}</p>}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSavePayment}
                className="flex-1 gradient-bg text-foreground border-0 hover:opacity-90"
              >
                Save Payment Method
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="bg-muted border-border hover:bg-accent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
