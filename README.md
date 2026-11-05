# Deynao — application FastAPI

Cette application sert l’interface web Deynao et ajoute un backend FastAPI pour tester une connexion Oracle et collecter les indicateurs exposés par les vues Oracle accessibles au compte configuré.

L’interface HTML/CSS/JavaScript existante est conservée pour rester proche du site de référence ; FastAPI sert les pages et fournit le backend Python. Les pages sont progressivement reliées à des collectes Oracle réelles.

## Démarrage local

```powershell
python -m pip install uv
python -m uv python install 3.13
python -m uv venv --python 3.13 .venv
python -m uv pip install --python .venv\Scripts\python.exe -r requirements.txt
.\.venv\Scripts\Activate.ps1
python -m uvicorn server:app --host 127.0.0.1 --port 8001
```

Ouvrir ensuite <http://127.0.0.1:8001>. Le port 8001 laisse l’application de référence sur le port 8000 inchangée. Le serveur est volontairement lié à `127.0.0.1` ; ne l’exposez pas sur un réseau sans ajouter authentification et configuration TLS.

La maquette statique reste disponible en ouvrant `index.html` directement. Dans ce mode, les fonctions FastAPI et Oracle ne sont pas disponibles.

## Connexion Oracle

Dans l’application, choisir **Nouvelle connexion** ou **Configurer Oracle**, saisir l’hôte, le port, le nom de service, l’utilisateur et le mot de passe, puis se connecter. FastAPI teste la connexion avec une requête `SELECT 1 FROM dual`.

- Python 3.11 à 3.13 est recommandé pour les roues binaires disponibles du pilote `python-oracledb`. Le pilote fonctionne en mode Thin ; aucun Oracle Instant Client n’est requis dans ce mode.
- Les identifiants sont gardés uniquement en mémoire dans le processus serveur. Ils ne sont pas écrits dans le navigateur, dans `.env` ou sur disque.
- Le parc conserve dans le navigateur les informations **non secrètes** des connexions (nom, hôte, port, service, utilisateur, environnement). La session Oracle, elle, reste en mémoire serveur : après un redémarrage, la fiche indique « Profil enregistré — session Oracle inactive » et le bouton **Se reconnecter** permet de saisir à nouveau le mot de passe sans ressaisir le reste.
- Redémarrer le serveur efface la connexion. Le bouton **Déconnecter** l’efface également.
- Les indicateurs demandent des privilèges de lecture sur les vues Oracle correspondantes (`V$...`, `USER_...`, `DBA_DATA_FILES`, `DBA_FREE_SPACE` et `DBA_TEMP_FILES`). Une erreur de privilège est signalée et ne doit pas être interprétée comme une valeur nulle.
- Seules les collectes SQL `SELECT` sont implémentées. Aucune commande de modification n’est exécutée sur la base.
- Le taux de transactions utilise `V$SYSMETRIC` quand disponible, puis les compteurs cumulés de `V$SYSSTAT`. Ce dernier nécessite deux collectes espacées d’au moins une seconde ; avant cela, la valeur reste indisponible.

## Données et limites

Sans connexion Oracle, la maquette conserve ses exemples et affiche explicitement qu’ils ne sont pas issus d’une collecte réelle. Après connexion, la page d’ensemble et les domaines implémentés affichent les valeurs retournées par Oracle. La capacité est calculée sur l’espace physique alloué et utilisé, sans la capacité potentielle d’extension automatique ; les métriques SGA/PGA utilisent leurs tailles cibles et les allocations disponibles.

Les mesures et leurs formules sont en cours d’alignement avec le site de référence. Les scores Deynao, les recommandations détaillées et les vues non collectées ne sont pas calculés par cette version ; ils ne sont pas présentés comme des résultats Oracle réels lorsqu’une connexion est active. Les fonctions de gestion des utilisateurs, alertes Deynao, mails et paramètres restent des écrans de maquette. La connexion Oracle est volatile et mono-instance ; elle convient au développement local, pas à un déploiement multi-utilisateur.

## Tests

Avec l’environnement virtuel créé ci-dessus activé :

```powershell
python -m pip install -r requirements-dev.txt
python -m pytest
```
