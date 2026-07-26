import { DataSource } from 'typeorm';
import { Badge } from 'src/badges/entities/badge.entity';

export async function seedBadges(dataSource: DataSource) {
  const badgeRepository = dataSource.getRepository(Badge);

  const badges = [
    {
      code: 'PASSEUR_ELAN',
      name: "Passeur d'Élan",
      description: '3 validations consécutives',
    },
    {
      code: 'DEBUT_3J',
      name: 'Badge du 3ᵉ jour',
      description: '3 jours de constance atteints',
    },
    // ... ajoute tes autres badges
  ];

  for (const badgeData of badges) {
    const exists = await badgeRepository.findOne({
      where: { code: badgeData.code },
    });
    if (!exists) {
      await badgeRepository.save(badgeRepository.create(badgeData));
    }
  }

  console.log('Badges seeded');
}