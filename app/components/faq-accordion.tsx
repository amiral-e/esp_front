"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqAccordion() {
  const faqs = [
    {
      question: "Quels types de documents financiers puis-je télécharger ?",
      answer:
        "Vous pouvez télécharger une grande variété de documents financiers, notamment des factures, des reçus, des relevés bancaires, des formulaires fiscaux, des comptes de résultat, des bilans et bien plus encore. Notre IA peut traiter des PDF, des images et des fichiers Excel.",
    },
    {
      question: "Mes données financières sont-elles sécurisées ?",
      answer:
        "Nous prenons la sécurité très au sérieux. Toutes vos données sont chiffrées en transit et au repos avec un chiffrement de niveau bancaire. Nous ne partageons jamais vos informations avec des tiers, et nos systèmes sont conformes aux normes de sécurité du secteur.",
    },
    {
      question: "Puis-je connecter mon logiciel de comptabilité ?",
      answer:
        "Oui, ComptaCompanion s'intègre avec les logiciels de comptabilité populaires comme QuickBooks, Sage, et FreshBooks. Cela permet une synchronisation fluide des données et des analyses financières plus complètes.",
    },
    {
      question: "Quelle est la précision de l'IA dans l'analyse des documents financiers ?",
      answer:
        "Notre IA a été entraînée sur des millions de documents financiers et atteint une précision de plus de 98% dans l'extraction et l'analyse des données. Pour les documents complexes, notre système indiquera les niveaux de confiance et pourra suggérer une vérification humaine pour certains éléments.",
    },
    {
      question: "Puis-je exporter les analyses et les données de la plateforme ?",
      answer:
        "Oui, tous les forfaits Professionnel et Entreprise incluent des fonctionnalités d'exportation. Vous pouvez exporter les données dans différents formats, notamment PDF, Excel et CSV. Vous pouvez également générer des rapports personnalisés en fonction de vos besoins spécifiques.",
    },
    {
      question: "Proposez-vous un essai gratuit ?",
      answer:
        "Oui, nous proposons un forfait gratuit qui vous permet de télécharger jusqu'à 5 documents par mois. Cela vous donne l'occasion d'essayer la plateforme avant de vous engager dans un abonnement payant.",
    },
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}