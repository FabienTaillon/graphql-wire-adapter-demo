# config hook path
git config core.hooksPath hooks
echo '##### CREATING SCRATCH ORG #####'
SCRATCH_ALIAS=$1
PROJECT_NAME=${PWD##*/}
SCRATCH_ALIAS="${SCRATCH_ALIAS:-$PROJECT_NAME-`git branch | grep \* | cut -d ' ' -f2`}" 
sf org create scratch --definition-file config/project-scratch-def.json --alias $SCRATCH_ALIAS --set-default --wait 10
echo '##### PUSHING METADATA #####'
sf project deploy start --source-dir force-app --target-org $SCRATCH_ALIAS
echo '##### ASSIGNING PERMISSIONS #####'
sfdx force user permset assign --perm-set-name DreaminEvent --target-org $SCRATCH_ALIAS
echo '##### IMPORTING DUMMY DATA #####'
sf texei data import --inputdir ./data --target-org $SCRATCH_ALIAS
echo '##### CLEANING STANDARD LAYOUTS #####'
sf texei source layouts cleanorg --target-org $SCRATCH_ALIAS
echo '##### ENABLE LWC DEBUG MODE #####'
sf texei debug lwc enable --target-org $SCRATCH_ALIAS
echo '##### OPENING SCRATCH ORG #####'
sf org open --path lightning/n/Dreamin_Event_Explorer --target-org $SCRATCH_ALIAS