# Spécification de l’interface utilisateur — Deynao

## 1. Objet et périmètre

Ce document décrit l’interface web de Deynao, application de supervision et de diagnostic Oracle, afin qu’une équipe puisse en reconstruire les écrans et les parcours.

La spécification est issue d’une exploration manuelle de l’application web, en français, le 2 novembre 2026. La version affichée est **1.0.3**. Les données visibles correspondaient à un parc de démonstration comportant une base `FREEDB` en environnement TEST. Ces valeurs (scores, compteurs, noms d’instance) sont des exemples dynamiques, pas des valeurs à coder en dur.

Les principales pages, menus, formulaires, onglets et états vides ont été examinés. Les formulaires de création/modification n’ont pas été soumis et aucun fichier `alert.log` n’a été importé. Le résultat post-analyse d’un fichier n’a donc pas été observé.

## 2. Produit et principes d’expérience

- Application d’administration destinée à la supervision Oracle, à la consultation d’alertes et au diagnostic.
- Interface initialement en français, avec choix de langue **Français / English**.
- Navigation principale persistante sur les pages standard : parc, supervision, historique des alertes, analyse des alertes Oracle, documentation, paramètres et utilisateurs.
- La supervision détaillée d’une base dispose de son propre espace de navigation et de son propre en-tête.
- Priorité aux états lisibles et synthétiques : scores, statuts textuels, badges colorés, compteurs, cartes, progressions et tableaux.
- Les données de supervision se chargent de manière asynchrone. Les vues doivent distinguer l’attente, les données disponibles, l’absence de données et les erreurs.
- L’interface de supervision déclare interroger Oracle à distance en lecture seule, sans agent installé sur la base.

## 3. Structure globale et système visuel

### 3.1 Shell des pages standard

Sur les pages standard, utiliser une mise en page en deux zones :

1. **Barre latérale gauche** persistante, avec marque Deynao, slogan « Supervision et diagnostic Oracle », navigation, raccourcis système/aide, identité utilisateur, état du service et numéro de version.
2. **Zone principale** claire, scrollable, avec titres de page, actions, contenu en cartes et tableaux.

La barre latérale est sombre (anthracite/brun très foncé) et les surfaces de contenu sont blanches ou gris très clair. Le orange vif est la couleur d’accent principale : icônes de marque, bordures/soulignements actifs, actions primaires et score. Les cartes ont des coins arrondis, des bordures discrètes et une ombre légère. Les statuts utilisent aussi le vert, l’ambre, le rouge et le bleu ; ne pas communiquer un état uniquement par la couleur.

La typographie est sans sérif. La hiérarchie observée comprend un titre de page prominent, des titres de cartes, des libellés compacts et des textes secondaires gris. Les icônes sont monochromes ou accentuées, généralement placées à gauche des libellés.

Les captures ont été réalisées sur un viewport desktop d’environ 1337 × 962 px. La disposition mobile n’a pas été vérifiée : la reproduction doit néanmoins éviter le débordement horizontal et rendre navigation, tableaux et formulaires utilisables sur petit écran.

### 3.2 États et composants transverses

- État de service dans la barre latérale : « Système prêt » / « Service Deynao opérationnel », avec variantes de vérification ou d’erreur.
- Version de l’application en pied de barre latérale (exemple : 1.0.3).
- Boutons avec états normal, survol/focus, actif/pressed, désactivé et chargement.
- Champs avec libellé visible, placeholder, état focus, erreur de validation et texte d’aide.
- Boutons d’affichage/masquage des secrets à côté des champs mot de passe.
- Dialogues avec titre, bouton « Fermer », actions en pied de dialogue et fermeture/annulation.
- Toasts/statuts pour les opérations comme une reconnexion réussie.
- Icônes décoratives masquées aux technologies d’assistance ; les commandes icône seule doivent avoir un nom accessible explicite.
- Dates affichées au format français dans les pages françaises ; les dates relatives (« il y a… ») sont utilisées pour l’activité et la fraîcheur des données.

## 4. Connexion

**Route observée :** `/login` (la racine `/` affiche le parc après authentification).

### Composition

- Fond clair, contenu de connexion centré en carte.
- Sélecteur de langue en haut : boutons FR et EN.
- Logo, titre « Deynao » et sous-titre « Supervision et diagnostic Oracle ».
- Carte avec titre « Connexion » et texte d’invitation.
- Champs « Identifiant » et « Mot de passe » ; le mot de passe est masqué par défaut.
- Bouton « Afficher le mot de passe ».
- Bouton d’action « Se connecter », désactivé tant que les champs requis sont vides, puis état de soumission/chargement.
- Afficher explicitement les erreurs d’authentification sans effacer les valeurs sans raison.

Après connexion, rediriger vers le parc. Ne jamais afficher ni intégrer des identifiants de démonstration dans l’interface ou cette spécification.

## 5. Parc de bases Oracle

**Route :** `/`.

### En-tête et synthèse

- Titre « Parc de bases » et action primaire « Nouvelle connexion ».
- Compteurs interactifs « Parc : N » et « Surveillées auto : N ».
- Indicateur d’actualisation avec dernière date/heure, affichée aussi en relatif.
- Bouton « Rafraîchir ».

### Barre de recherche et filtres

- Recherche avec placeholder « Rechercher par nom, IP, service… ».
- Filtre d’environnement sous forme de groupe de boutons : **Tous**, **PROD**, **TEST**, **DEV**, chacun avec compteur.
- Filtre d’état de surveillance : **Surveillées auto** et **À la demande**, avec compteurs.
- Sélecteur de présentation accessible : **Cartes** ou **Tableau**.
- Les filtres sont combinables avec la recherche et mettent à jour le nombre de résultats.
- Si aucun résultat ne correspond, montrer un état vide et permettre d’effacer les filtres.

### Carte d’une connexion

La carte observée présente :

- Nom de la connexion (exemple : `FREEDB`), badge d’environnement et état de supervision (« À la demande »).
- Serveur et port, service Oracle, utilisateur Oracle et nom d’hôte.
- Date relative de dernière utilisation depuis le poste.
- Bouton « Tableau de bord en direct » qui ouvre la supervision détaillée et affiche une étape de connexion/collecte.
- Menu « Actions de la connexion ».

Les identifiants ne sont pas affichés. Les informations de connexion visibles sont les éléments nécessaires à l’identification de la base.

### Menu des actions de connexion

Le menu déroulant observé contient :

- **Statistiques rapides** : ouvre un dialogue « Statistiques Oracle ».
- **Diagnostic express**.
- **Copier les informations**.
- **Renommer**.
- **Modifier**.
- **Activer la surveillance auto 24/7** ou l’action inverse selon l’état.
- **Maintenance planifiée**.
- **Supprimer**.

Les actions modifiant ou supprimant une connexion doivent demander confirmation lorsque nécessaire. Ne pas déclencher ces opérations à l’ouverture du menu.

### Dialogue « Statistiques Oracle »

Le dialogue contient :

- En-tête avec titre, nom de la base, environnement et bouton « Fermer ».
- Score de santé synthétique, libellé de posture et liste de points d’attention par domaine.
- « Informations de l’instance » : nom, statut, état de base, connexions, version, disponibilité, mode ARCHIVELOG, mode d’ouverture, hôte et type de licence si disponible.
- « Sessions Oracle » : actives, en attente, inactives, maximum et note si les sessions de supervision Deynao sont exclues des compteurs.
- « Tablespaces à surveiller » avec barre de progression, taux utilisé et indication autoextend.
- Section dépliable « Plan d’action et recommandations détaillés ».
- Actions en pied : « Copier le rapport détaillé » et « Supervision complète ».

### Formulaire « Nouvelle Connexion »

Présenté comme panneau/dialogue au-dessus du parc :

- En-tête « Nouvelle Connexion », description « Connectez une base Oracle à superviser ».
- **Nom de connexion**.
- **Serveur*** et **Port*** (port prérempli à 1521).
- **Service***.
- **Utilisateur***.
- Case « Se connecter en tant que SYSDBA », avec avertissement de ne l’activer que si le compte dispose des privilèges SYSDBA/SYSOPER.
- Contrôle ouvrant l’aide « Compte de supervision dédié (recommandé) » et expliquant le compte dédié en lecture seule.
- **Environnement*** : Développement, Test ou Production.
- **Mot de passe***, masqué avec bouton d’affichage.
- Case cochée par défaut « Conserver cette base dans mon parc », avec explication que la connexion et les identifiants chiffrés sont conservés.
- Actions « Tester la connexion », « Annuler » et « Se connecter ».

Le formulaire doit valider les champs requis, afficher les erreurs de connexion et préserver une distinction claire entre connexion ponctuelle et enregistrement dans le parc.

### Vue Tableau du parc

- Titre « Bases Oracle (Vue Tableau) – N connexions ».
- Bouton « Export Excel ».
- Tableau triable (en-têtes cliquables) : **Nom**, **Env.**, **Serveur**, **Service**, **Utilisateur**, **Supervision**, **Collecte**, **Score**, **Actions**.
- Chaque ligne propose une action pour ouvrir la supervision en direct et le menu d’actions de connexion.
- Sélecteur « Lignes par page » avec 10, 25, 50 ou Tout, ainsi que le compteur/plage de résultats.

## 6. Supervision détaillée d’une base

**Route observée :** `/supervision`.

### 6.1 Chargement et sortie

À l’ouverture de « Tableau de bord en direct », afficher une vue de transition avec logo, nom du produit, message « Connexion à Oracle… », durée écoulée et bouton « Annuler ». Pendant la collecte, la progression globale et les domaines chargés peuvent être affichés. Les domaines observés sont Performance, Capacité, Processus, Journalisation, Attentes, Verrous, Jobs Oracle, Fichiers, Objets, Sauvegardes, Alertes Oracle, Sécurité, Licences et Recommandations.

Après chargement, l’écran est un espace dédié, avec navigation latérale et bouton « Retour au parc ».

### 6.2 En-tête partagé

- Identité de la base (exemple : `FREE`) et badge d’environnement.
- Carte/bouton du **Score de Santé** global, pourcentage, libellé et liste des domaines critiques.
- « Actualisé il y a… », bouton/sélecteur « Actualisation : Manuel » avec choix de cadence si disponible, et « Actualiser maintenant ».
- Version Oracle et disponibilité/temps depuis le démarrage.
- La navigation latérale garde les 14 domaines visibles et met en évidence le domaine actif par une surface claire et un accent orange.

### 6.3 Vue d’ensemble

- Bouton « Exporter en PDF » de la vue d’ensemble.
- Carte « Synthèse exécutive » : posture globale, nombre et niveaux d’actions, indicateurs de disponibilité/performance/risque, points d’attention et actions suggérées.
- Boutons de raccourci vers les filtres de recommandations par criticité.
- Grille « Accès rapide aux 14 domaines de supervision » : titre, score lorsque disponible, résumé d’état et ouverture de la vue détaillée.
- Cartes synthétiques pour tablespaces, sessions Oracle et alertes critiques des dernières 24 h.
- Raccourcis « Que regarder en priorité ? » et « Voir l’aide ».
- Le score précise son périmètre de calcul ; les valeurs d’exemple étaient calculées sur 12 domaines pondérés.

### 6.4 Domaines et contenu attendu

Chaque domaine a un titre, une phrase descriptive, un score ou indice quand applicable, des cartes KPI, une visualisation/tableau détaillé, un état de chargement, un message vide si nécessaire et une aide contextuelle. Plusieurs vues proposent CSV/PDF et actualisation des données.

Les sous-vues d’un domaine sont accessibles par une barre d’onglets horizontale placée après les éléments de synthèse du domaine. Les onglets occupent une largeur égale, affichent une icône et un libellé centrés, et s’inscrivent dans un bandeau gris clair. L’onglet actif ressort sur fond blanc avec une légère ombre et un trait orange inférieur. Sur petit écran, la barre défile horizontalement sans réduire les libellés.

| Domaine | Contenu observé |
|---|---|
| **Performance** | Score de performance ; SGA, PGA, CPU système, sessions, cache hit ratio et transactions ; indicateurs de santé (CPU, cache, sessions, I/O, mémoire) ; métriques temps réel (DB Time, charge Oracle/AAS, exécutions SQL) ; consommateurs de ressources. Onglets observés : Vue d’ensemble, Mémoire, CPU, I/O & Cache, Aide. Exports CSV/PDF. |
| **Capacité** | Score de capacité ; tablespaces à surveiller, utilisation totale, protection autoextend et espace libre ; graphique Top 10 et légende d’état ; liste des tablespaces classés en surveillance/temporaire/autres, chacun avec barre d’usage, taille et détails ouvrables. Onglets : Vue d’ensemble, Détails avec compteur, Analyse, Recommandations, Aide. CSV/PDF. |
| **Processus** | Score ; slots processus, processus essentiels, empreinte mémoire, processus utilisateur ; contexte technique (mode de connexion, vues Oracle, durée/source) ; listes de processus système et utilisateurs, état des processus essentiels. Onglets : Vue d’ensemble, Processus système, Processus utilisateur, Aide. |
| **Journalisation** | Score ; mode ARCHIVELOG, groupes REDO, rétention UNDO, espace d’archive ; indicateurs opérationnels pour ARCHIVELOG, REDO et UNDO ; capacité de récupération et recommandations prioritaires. Onglets ARCHIVELOG, REDO LOG, UNDO et Aide. CSV/PDF. |
| **Attentes** | Score ; sessions en attente, attentes critiques, latence I/O et classes problématiques ; diagnostic synthétique ; événements d’attente classés avec impact, occurrences, moyenne et durée ; distribution par classe. Onglets : Vue d’ensemble, En direct, Historique, Analyse, Aide. CSV/PDF et instantané. |
| **Verrous** | Score ; sessions bloquantes, deadlocks, sessions longues et verrous totaux ; chaînes de blocage et sessions ; outils d’analyse et d’action. Onglets : Vue d’ensemble, Chaînes de blocage, Sessions longues, Analyse & Actions, Aide. |
| **Jobs** | Score ; jobs applicatifs, jobs actifs/en cours/planifiés, échecs et historique. Les jobs système sont séparés des jobs applicatifs et accessibles dans une vue avancée. |
| **Fichiers** | Score et état de l’infrastructure de fichiers Oracle : SPFILE, control files, groupes REDO et datafiles ; nombre, multiplexage et recommandations associés. CSV/PDF. |
| **Objets** | Score et inventaire par catégorie : schémas, tables, index, vues et autres objets ; distinguer objets applicatifs et objets système. CSV/PDF. |
| **Sauvegardes** | Score ; suivi RMAN et FRA ; total des sauvegardes, taux de réussite, volume produit et durée moyenne ; états sans donnée lorsque l’historique est vide. CSV/PDF. |
| **Alertes Oracle** | Score ; analyse de `alert.log`/`V$DIAG_ALERT_EXT`, codes ORA, sévérité et fréquence ; sélecteur de période (24 h, 7 j, 30 j observé), compteurs d’alertes et occurrences brutes, filtres et résultats détaillés. CSV/PDF. À distinguer de l’historique d’alertes levées par Deynao. |
| **Sécurité** | Score, fraîcheur de collecte, comptes à risque, comptes à privilèges élevés, politique de mot de passe, audit Oracle et contrôles de configuration. Mettre les observations et recommandations en évidence. |
| **Licences** | Indice de vigilance, édition/version observées, options payantes et packs à vérifier ; avertissement clair que la détection technique ne remplace pas la validation contractuelle. |
| **Recommandations** | Plan d’action transverse ; total des items ; compteurs/actions par niveaux **Action immédiate**, **Action prioritaire**, **Surveillance**, **Optimisation** ; couverture d’analyse ; vue d’ensemble, plan d’action et aide. Les cartes de niveau filtrent le plan ; export CSV, rapport PDF et actualisation. |

Les fiches de domaine détaillées étant chargées à partir des réponses Oracle, ne pas reproduire les nombres d’exemple du tableau comme données statiques. Les champs absents doivent être présentés comme « — », « Aucune donnée » ou un état équivalent explicite, selon le contexte.

## 7. Historique des alertes de supervision

**Route :** `/alerts-history`.

Il s’agit des alertes générées par la supervision Deynao ; ce n’est pas l’analyse du journal Oracle `alert.log`.

### En-tête et actions

- Titre « Historique des alertes » et texte de clarification.
- Bouton « Comment fonctionnent les alertes ? ».
- Filtres rapides **Toutes**, **Actives**, **Résolues**.
- Boutons « Export Excel » et « Actualiser ».

### Filtres détaillés

- Recherche par base, message ou règle.
- Sélecteur **Base** (toutes les bases ou une base nommée).
- Sélecteur **Par page** : 25, 50, 100.
- Sévérité : boutons de filtre **Critique**, **Avertissement**, **Info**.
- Période : **24 h**, **7 j**, **30 j**, **Tout**, **Personnalisée**.
- Bouton « Réinitialiser ».
- Indicateurs du nombre d’alertes actives et résolues.
- Liste/tableau paginé lorsque des résultats existent ; état vide observé : « Aucune alerte — tout est calme », accompagné d’une explication.

### Dialogue « Comment fonctionnent les alertes ? »

Dialogue informatif à onglets :

- **Vue d’ensemble** : fonctionnement de l’alerting, temporisation/règles et garde-fous « Authentification bloquée » et « Injoignable ».
- **Les règles** : documentation des règles et seuils.
- **Cycle de vie** : explication des transitions et résolutions d’alertes.
- Indication de transparence : les seuils proviennent du moteur de supervision.
- Bouton « Fermer ».

## 8. Analyse des alertes Oracle / alert.log

**Route :** `/alerts-analysis`.

- Titre « Analyse Avancée Oracle » et description du diagnostic automatisé des fichiers `alert.log`.
- Zone de dépôt avec glisser-déposer et bouton « Parcourir les fichiers ».
- Formats acceptés affichés : `.log`, `.txt`, `.out`, taille maximale 100 Mo.
- Mention de déploiement on-premise et de conservation des données sur l’infrastructure.
- Bloc « Pourquoi Deynao » présentant quatre bénéfices : analyse multi-versions (11g à 23ai), base de connaissances Oracle/DIAG-LONG, regroupement des occurrences et déploiement on-premise.
- Accordéon/guide « Comment récupérer votre fichier alert.log ? ».
- Bloc d’appel à l’action « Prêt à commencer ? » et bouton « Analyser mon fichier alert.log ».

Le guide développé contient les étapes suivantes :

1. Identifier `diagnostic_dest` via `SHOW PARAMETER diagnostic_dest` ou une requête sur `v$parameter`.
2. Naviguer sous `[DIAGNOSTIC_DEST]/diag/rdbms/[NOM_BASE]/[SID]/trace/` et repérer `alert_[SID].log`.
3. Exemples distincts Windows et Linux/Unix, avec chemins typiques et commandes de recherche.
4. Conseils débutants et d’analyse (faire appel au DBA, prendre les 2–3 derniers jours, respecter la limite de 100 Mo et conserver une copie).

Prévoir les états de dépôt, validation du type/taille, progression d’analyse, erreur de lecture et résultats. Le résultat détaillé après import n’a pas été observé.

## 9. Paramètres

**Route :** `/parametres`.

Page longue, organisée en cartes.

### Messagerie

- Description de l’utilisation du serveur SMTP pour les alertes par e-mail.
- Avertissement indiquant que les réglages peuvent provenir de la configuration d’installation et être pilotés depuis cette page après enregistrement.
- Case **Activer l’alerting par e-mail** avec texte explicatif.
- Champs **Serveur**, **Port** (valeur par défaut observée : 587), **Utilisateur**, **Mot de passe** avec visibilité contrôlable.
- Sélecteur **Chiffrement TLS** : Automatique (recommandé), Obligatoire, Désactivé ; texte d’aide.
- Champs **Expéditeur** et **Langue des e-mails** (Français/English), indépendante de la langue de l’interface.
- Champ **Destinataires**, adresses séparées par des virgules.
- Case **Rapport quotidien par e-mail** et bouton « Envoyer le rapport maintenant » (désactivé si les prérequis ne sont pas remplis).
- Champ d’adresse « Envoyer le mail de test à », mémorisé sur cet appareil et indépendant des destinataires configurés.
- Actions « Vérifier la connexion », « Envoyer un mail de test », « Annuler », « Enregistrer ».
- Expliquer que les tests envoient une requête immédiate même si l’alerting est désactivé.

### Licence

- État, édition, client, expiration/temps restant, nombre d’instances couvertes et fonctionnalités.
- Champ « Coller votre clé de licence » et bouton « Activer », désactivé sans clé.
- Les valeurs observées (licence valide d’évaluation, échéance, fonctionnalités) sont des valeurs d’exemple.

### Santé de Deynao

- Carte « Santé de Deynao » avec statut général, version, durée de service, base de données, migrations, collecteur/dernier battement et file d’e-mails.
- Horodatage de la dernière vérification et bouton « Rafraîchir ».

### Journal des envois

- Derniers e-mails émis par Deynao ou état vide « Aucun envoi enregistré ».
- Horodatage et bouton « Rafraîchir ».
- Lien « Voir le journal complet » vers `/parametres/journal-envois`.

### Journal complet des envois

**Route :** `/parametres/journal-envois`.

- Titre « Journal des envois », texte indiquant que la page sert à auditer les e-mails émis, avec filtres, pagination et export.
- Bouton « Comment fonctionne le Journal des envois ? ».
- Filtres rapides **Tous**, **Envoyés**, **Échecs** ; actions **Export Excel** et **Actualiser**.
- Recherche par base, type ou message.
- Sélecteur **Type** : Tous les types, Alerte levée, Rappel, Escalade, Résolue, Rapport quotidien, Alerte.
- Période : **24 h**, **7 j**, **30 j**, **Tout**.
- **Par page** : 25, 50 ou 100 ; bouton **Réinitialiser**.
- Compteurs d’envois réussis et d’échecs.
- État vide observé : « Aucun envoi » avec explication que les messages apparaîtront à l’émission d’une alerte ou d’un rapport.

## 10. Utilisateurs

**Route :** `/utilisateurs`.

- Titre « Utilisateurs », description de gestion des comptes et bouton « Nouvel utilisateur ».
- Tableau : **Identifiant**, **Nom**, **Rôle**, **Actif**, **Dernière connexion**, **Actions**.
- Rôles proposés : **Administrateur**, **Opérateur**, **Lecteur**.
- Ligne de l’utilisateur courant signalée « vous » ; les actions visant l’administrateur courant peuvent être désactivées.
- Actions de ligne prévues : « Réinitialiser », activer/désactiver, « Supprimer » ; opérations sensibles à confirmer.

### Dialogue de création

- **Identifiant**.
- **Nom affiché (optionnel)**.
- **Mot de passe**, masquable/affichable ; minimum observé de 12 caractères et au moins 3 familles parmi minuscule, majuscule, chiffre et caractère spécial.
- Case cochée par défaut « Forcer le changement du mot de passe à la 1ʳᵉ connexion », avec note permettant de la décocher pour un compte de service.
- **Rôle** avec Administrateur, Opérateur, Lecteur ; Lecteur sélectionné par défaut.
- Boutons « Annuler » et « Créer le compte », ce dernier désactivé tant que les champs requis ne sont pas valides.

### Dialogue de changement de mot de passe

Accessible depuis le menu utilisateur :

- Ancien mot de passe, nouveau mot de passe et confirmation.
- Contrôles de visibilité pour les mots de passe.
- Même règle de robustesse (12 caractères et 3 types).
- Boutons « Annuler » et « Mettre à jour » ; mise à jour désactivée tant que le formulaire n’est pas valide.

## 11. Documentation intégrée

**Route :** `/documentation`.

Centre d’aide intégré dans le shell standard, avec titre « Documentation ». Le contenu est organisé en scénarios et guides plutôt qu’en simple texte :

- Section **Comment faire pour…** avec raccourcis vers l’ajout d’une base, l’état de santé, les alertes, leurs règles, la configuration e-mail, la licence et la gestion des comptes.
- Scénarios « Quand quelque chose arrive » : arrivée d’une alerte, base orange, lecture d’une note de santé et de sa couverture.
- **Prise en main**, avec liens vers le compte Oracle de supervision et l’installation en service Windows.
- **Comprendre les domaines** : regroupement par familles comme activité/performance, capacité/contenu, exploitation/continuité et sécurité/conformité/synthèse.
- Liens de navigation vers la supervision et l’espace documentaire.
- **Documents de référence** sous forme de liens/tuiles PDF (licence, choix du paquet, FAQ/limites, mise à jour, SMTP, prérequis réseau, présentation, règles d’alerte, sécurité, transparence Oracle).

Les boutons de scénarios doivent naviguer vers la page ou section indiquée. Les liens PDF doivent être présentés comme des téléchargements/documents, avec leur intitulé et éventuellement leur taille.

## 12. Langue et compte utilisateur

- Bouton **Langue** dans la barre latérale. Menu proposant **Français** et **English** ; langue courante marquée.
- La langue d’interface est indépendante de la langue des e-mails configurée dans les paramètres.
- Bouton utilisateur avec initiale/avatar, identifiant et rôle.
- Menu utilisateur : identité, **Changer mon mot de passe**, **Déconnexion**.
- À la déconnexion, terminer la session et retourner à l’écran de connexion.

## 13. Navigation et URL observées

| Écran | URL |
|---|---|
| Connexion | `/login` |
| Parc de bases | `/` |
| Supervision détaillée | `/supervision` |
| Historique des alertes de supervision | `/alerts-history` |
| Analyse Oracle / alert.log | `/alerts-analysis` |
| Paramètres | `/parametres` |
| Journal complet des envois | `/parametres/journal-envois` |
| Utilisateurs | `/utilisateurs` |
| Documentation | `/documentation` |

Les sous-vues des 14 domaines sont pilotées depuis la barre latérale du tableau de bord de supervision. Leur navigation visuelle est conservée pendant le changement de domaine.

## 14. États à reproduire et règles de comportement

1. **Chargement initial** : squelette/indicateur et libellé explicite ; ne pas afficher une valeur de succès provisoire.
2. **Connexion à la base** : progression et durée, possibilité d’annuler.
3. **Rafraîchissement** : désactiver ou mettre en chargement le contrôle concerné, indiquer l’heure de collecte.
4. **Données vides** : message explicite (pas d’alerte, pas de sauvegarde, aucune session) avec prochaine action utile.
5. **Échec** : message contextualisé et possibilité de réessayer ; ne pas remplacer silencieusement une erreur par un état sain.
6. **Action destructive** : confirmation et retour de résultat.
7. **Filtres** : conserver les critères actifs, proposer une remise à zéro et afficher le volume de résultats.
8. **Exports** : refléter la vue/les filtres actifs et informer l’utilisateur du résultat de l’export.
9. **Saisie sensible** : masquer les secrets par défaut et n’exposer aucune valeur dans les listes.
10. **Statuts** : associer couleur, libellé et éventuellement icône ; distinguer notamment optimal, attention, surveillance, critique, information et absence de données.

## 15. Critères de reproduction

- Toutes les pages standard partagent la barre latérale et les éléments de statut/version.
- Les 14 domaines sont accessibles depuis le tableau de bord d’une base et mettent en évidence le domaine courant.
- Les nombres et statuts dépendent des données ; les états vides et d’erreur sont implémentés.
- Chaque formulaire expose des libellés, aides, validations, états désactivés et annulation.
- Les dialogues et menus sont accessibles au clavier, ont un nom accessible et gèrent correctement le focus.
- Les tableaux ont des en-têtes sémantiques ; lorsqu’ils sont triables, leur état de tri est perceptible.
- La recherche, les filtres, la pagination, les exports et les contrôles d’actualisation sont fonctionnels, pas seulement décoratifs.
- Les différences entre alertes de supervision Deynao et alertes Oracle `alert.log` sont visibles et cohérentes dans navigation, titres et aide.
- La version de bureau doit rester proche de la hiérarchie et des contrastes observés, tout en restant utilisable sur les petites largeurs.
