import type { FC } from "react";
import { useState } from "react";
import { Edit03, Plus, Trash01 } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { AddFAQModal, type FAQFormData } from "@/components/domain/support/add-faq-modal";
import { AddGuideModal, type GuideFormData } from "@/components/domain/support/add-guide-modal";
import { t } from "@/i18n/translations";

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
}

interface Guide {
    id: string;
    title: string;
    content: string;
    category: string;
    order: number;
}

/**
 * Support page
 * Manage FAQs and Guides for customer self-service support.
 */
export const SupportPage: FC = () => {
    // Mock data - in production, this would come from a query
    const [faqs, setFaqs] = useState<FAQ[]>([
        {
            id: "1",
            question: "How do I book a bay?",
            answer: "You can book a bay through our online portal, by calling us, or in person at the facility.",
            category: "Booking",
            order: 1,
        },
        {
            id: "2",
            question: "What is your cancellation policy?",
            answer: "Cancellations made 24 hours before the booking receive a full refund. Cancellations within 24 hours are non-refundable.",
            category: "Policies",
            order: 2,
        },
    ]);

    const [guides, setGuides] = useState<Guide[]>([
        {
            id: "1",
            title: "Getting Started with Bay Booking",
            content: "Learn how to book your first simulator bay session...",
            category: "Getting Started",
            order: 1,
        },
    ]);

    const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
    const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
    const [activeTab, setActiveTab] = useState<"faqs" | "guides">("faqs");

    const handleAddFAQ = (faqData: FAQFormData) => {
        // TODO: Implement mutation to add FAQ
        const newFAQ: FAQ = {
            id: Date.now().toString(),
            ...faqData,
            order: faqs.length + 1,
        };
        setFaqs([...faqs, newFAQ]);
        setIsFAQModalOpen(false);
    };

    const handleUpdateFAQ = (faqId: string, faqData: FAQFormData) => {
        // TODO: Implement mutation to update FAQ
        setFaqs(faqs.map((faq) => (faq.id === faqId ? { ...faq, ...faqData } : faq)));
        setIsFAQModalOpen(false);
        setEditingFAQ(null);
    };

    const handleDeleteFAQ = (faqId: string) => {
        // TODO: Implement mutation to delete FAQ
        setFaqs(faqs.filter((faq) => faq.id !== faqId));
    };

    const handleAddGuide = (guideData: GuideFormData) => {
        // TODO: Implement mutation to add Guide
        const newGuide: Guide = {
            id: Date.now().toString(),
            ...guideData,
            order: guides.length + 1,
        };
        setGuides([...guides, newGuide]);
        setIsGuideModalOpen(false);
    };

    const handleUpdateGuide = (guideId: string, guideData: GuideFormData) => {
        // TODO: Implement mutation to update Guide
        setGuides(guides.map((guide) => (guide.id === guideId ? { ...guide, ...guideData } : guide)));
        setIsGuideModalOpen(false);
        setEditingGuide(null);
    };

    const handleDeleteGuide = (guideId: string) => {
        // TODO: Implement mutation to delete Guide
        setGuides(guides.filter((guide) => guide.id !== guideId));
    };

    const handleEditFAQ = (faq: FAQ) => {
        setEditingFAQ(faq);
        setIsFAQModalOpen(true);
    };

    const handleEditGuide = (guide: Guide) => {
        setEditingGuide(guide);
        setIsGuideModalOpen(true);
    };

    const handleCloseFAQModal = () => {
        setIsFAQModalOpen(false);
        setEditingFAQ(null);
    };

    const handleCloseGuideModal = () => {
        setIsGuideModalOpen(false);
        setEditingGuide(null);
    };

    const categories = Array.from(new Set([...faqs.map((f) => f.category), ...guides.map((g) => g.category)]));

    return (
        <>
            <div className="flex h-full flex-col">
                <div className="border-b border-secondary bg-primary px-4 py-6 md:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-display-xs font-semibold text-primary">{t("settings.support.title")}</h1>
                            <p className="mt-1 text-md text-tertiary">{t("settings.support.subtitle")}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto px-4 py-6 md:px-8">
                    {/* Tabs */}
                    <div className="mb-6 flex gap-2 border-b border-secondary">
                        <button
                            onClick={() => setActiveTab("faqs")}
                            className={activeTab === "faqs" ? "border-b-2 border-brand-solid px-4 pb-3 text-sm font-medium text-primary" : "px-4 pb-3 text-sm font-medium text-tertiary hover:text-secondary"}
                        >
                            {t("settings.support.faqs.title")}
                        </button>
                        <button
                            onClick={() => setActiveTab("guides")}
                            className={activeTab === "guides" ? "border-b-2 border-brand-solid px-4 pb-3 text-sm font-medium text-primary" : "px-4 pb-3 text-sm font-medium text-tertiary hover:text-secondary"}
                        >
                            {t("settings.support.guides.title")}
                        </button>
                    </div>

                    {/* FAQs Tab */}
                    {activeTab === "faqs" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-primary">{t("settings.support.faqs.title")}</h2>
                                    <p className="mt-1 text-sm text-tertiary">{t("settings.support.faqs.description")}</p>
                                </div>
                                <Button color="primary" size="md" iconLeading={Plus} onPress={() => setIsFAQModalOpen(true)}>
                                    {t("settings.support.faqs.addFAQ")}
                                </Button>
                            </div>

                            {faqs.length === 0 ? (
                                <EmptyState>
                                    <EmptyState.Content>
                                        <EmptyState.Title>{t("settings.support.faqs.empty.title")}</EmptyState.Title>
                                        <EmptyState.Description>{t("settings.support.faqs.empty.description")}</EmptyState.Description>
                                    </EmptyState.Content>
                                    <EmptyState.Footer>
                                        <Button color="primary" iconLeading={Plus} onPress={() => setIsFAQModalOpen(true)}>
                                            {t("settings.support.faqs.empty.action")}
                                        </Button>
                                    </EmptyState.Footer>
                                </EmptyState>
                            ) : (
                                <div className="space-y-4">
                                    {categories.map((category) => {
                                        const categoryFAQs = faqs.filter((faq) => faq.category === category);
                                        if (categoryFAQs.length === 0) return null;

                                        return (
                                            <div key={category} className="rounded-lg border border-secondary bg-primary p-6 shadow-xs">
                                                <h3 className="mb-4 text-md font-semibold text-primary">{category}</h3>
                                                <div className="space-y-4">
                                                    {categoryFAQs.map((faq) => (
                                                        <div key={faq.id} className="rounded-lg border border-secondary bg-secondary p-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-primary">{faq.question}</div>
                                                                    <div className="mt-2 text-sm text-tertiary">{faq.answer}</div>
                                                                </div>
                                                                <div className="ml-4 flex items-center gap-2">
                                                                    <ButtonUtility
                                                                        size="sm"
                                                                        color="tertiary"
                                                                        icon={Edit03}
                                                                        aria-label={t("common.actions.edit")}
                                                                        onClick={() => handleEditFAQ(faq)}
                                                                    />
                                                                    <ButtonUtility
                                                                        size="sm"
                                                                        color="tertiary"
                                                                        icon={Trash01}
                                                                        aria-label={t("common.actions.delete")}
                                                                        onClick={() => handleDeleteFAQ(faq.id)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Guides Tab */}
                    {activeTab === "guides" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-primary">{t("settings.support.guides.title")}</h2>
                                    <p className="mt-1 text-sm text-tertiary">{t("settings.support.guides.description")}</p>
                                </div>
                                <Button color="primary" size="md" iconLeading={Plus} onPress={() => setIsGuideModalOpen(true)}>
                                    {t("settings.support.guides.addGuide")}
                                </Button>
                            </div>

                            {guides.length === 0 ? (
                                <EmptyState>
                                    <EmptyState.Content>
                                        <EmptyState.Title>{t("settings.support.guides.empty.title")}</EmptyState.Title>
                                        <EmptyState.Description>{t("settings.support.guides.empty.description")}</EmptyState.Description>
                                    </EmptyState.Content>
                                    <EmptyState.Footer>
                                        <Button color="primary" iconLeading={Plus} onPress={() => setIsGuideModalOpen(true)}>
                                            {t("settings.support.guides.empty.action")}
                                        </Button>
                                    </EmptyState.Footer>
                                </EmptyState>
                            ) : (
                                <div className="space-y-4">
                                    {categories.map((category) => {
                                        const categoryGuides = guides.filter((guide) => guide.category === category);
                                        if (categoryGuides.length === 0) return null;

                                        return (
                                            <div key={category} className="rounded-lg border border-secondary bg-primary p-6 shadow-xs">
                                                <h3 className="mb-4 text-md font-semibold text-primary">{category}</h3>
                                                <div className="space-y-4">
                                                    {categoryGuides.map((guide) => (
                                                        <div key={guide.id} className="rounded-lg border border-secondary bg-secondary p-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="font-medium text-primary">{guide.title}</div>
                                                                    <div className="mt-2 text-sm text-tertiary line-clamp-2">{guide.content}</div>
                                                                </div>
                                                                <div className="ml-4 flex items-center gap-2">
                                                                    <ButtonUtility
                                                                        size="sm"
                                                                        color="tertiary"
                                                                        icon={Edit03}
                                                                        aria-label={t("common.actions.edit")}
                                                                        onClick={() => handleEditGuide(guide)}
                                                                    />
                                                                    <ButtonUtility
                                                                        size="sm"
                                                                        color="tertiary"
                                                                        icon={Trash01}
                                                                        aria-label={t("common.actions.delete")}
                                                                        onClick={() => handleDeleteGuide(guide.id)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <AddFAQModal
                isOpen={isFAQModalOpen}
                onClose={handleCloseFAQModal}
                onAdd={handleAddFAQ}
                onUpdate={handleUpdateFAQ}
                faq={editingFAQ || undefined}
            />

            <AddGuideModal
                isOpen={isGuideModalOpen}
                onClose={handleCloseGuideModal}
                onAdd={handleAddGuide}
                onUpdate={handleUpdateGuide}
                guide={editingGuide || undefined}
            />
        </>
    );
};

