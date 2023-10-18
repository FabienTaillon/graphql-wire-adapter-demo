# config hook path
git config core.hooksPath hooks
echo '##### CREATING SCRATCH ORG #####'
SCRATCH_ALIAS=$1
PROJECT_NAME=${PWD##*/}
SCRATCH_ALIAS="${SCRATCH_ALIAS:-$PROJECT_NAME-`git branch | grep \* | cut -d ' ' -f2`}" 
sfdx org create scratch --definition-file config/project-scratch-def.json --alias $SCRATCH_ALIAS --set-default --wait 10
echo '##### PUSHING METADATA #####'
sfdx force:source:push --target-org $SCRATCH_ALIAS
echo '##### ASSIGNING PERMISSIONS #####'
sfdx force:user:permset:assign --perm-set-name DreaminEvent --target-org $SCRATCH_ALIAS
echo '##### IMPORTING DUMMY DATA #####'
sfdx texei:data:import --inputdir ./data --targetusername $SCRATCH_ALIAS
echo '##### CLEANING STANDARD LAYOUTS #####'
sfdx texei:source:layouts:cleanorg --targetusername $SCRATCH_ALIAS
echo '##### ENABLE LWC DEBUG MODE #####'
sf texei debug lwc enable
echo '##### OPENING SCRATCH ORG #####'
sfdx org:open --path lightning/n/Dreamin_Event_Explorer --target-org $SCRATCH_ALIAS