import { pricingPlans } from "@/data/pricing-plans";
import { PlanCard } from "@/components/pricing/plan-card";

export default function PricingPage() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
