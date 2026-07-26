import { DataSource } from 'typeorm';
import { Badge } from 'src/badges/entities/badge.entity';

export async function seedBadges(dataSource: DataSource) {
    const badgeRepository = dataSource.getRepository(Badge);

    const badges = [
    {
        code: 'DEBUT_3J',
        name: 'Badge du 3ᵉ jour',
        description: '3 jours de constance atteints',
    },
    {
        code: 'SEMAINE_PARFAITE',
        name: 'Semaine Parfaite',
        description: '7 jours consécutifs de validation',
    },
    {
        code: 'MOIS_SOLIDE',
        name: 'Mois Solide',
        description: '30 jours de constance cumulés sur un même projet',
    },
    {
        code: 'PASSEUR_ELAN',
        name: "Passeur d'Élan",
        description: '3 validations consécutives',
    },
    {
        code: 'HERITIER',
        name: 'Héritier',
        description: 'A repris un projet abandonné via Open-Relais',
    },
    {
        code: 'FLAMME_ETERNELLE',
        name: 'Flamme Éternelle',
        description: '100 jours de constance cumulés',
    },
    {
        code: 'PREMIER_PAS',
        name: 'Premier Pas',
        description: 'Première session validée sur un nouveau projet',
    },
    {
        code: 'MENTOR_COMMUNAUTE',
        name: 'Mentor de la Communauté',
        description: '10 commentaires laissés sous des projets publics',
    },
    {
        code: 'RESILIENT',
        name: 'Résilient',
        description: 'A repris un projet après une pause de 7+ jours',
    },
    {
        code: 'MULTI_OBJECTIFS',
        name: 'Multi-Objectifs',
        description: '3 projets actifs simultanément',
    },
    {
        code: 'LEGENDE_ELAN',
        name: "Légende d'Élan",
        description: '365 jours de constance cumulés',
    },
    ];

    for (const badgeData of badges) {
        const exists = await badgeRepository.findOne({
        where: { code: badgeData.code },
        });
        if (!exists) {
        await badgeRepository.save(badgeRepository.create(badgeData));
        }
    }

}