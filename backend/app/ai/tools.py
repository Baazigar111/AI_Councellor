def update_user_stage_tool(new_stage: str):
    """
    Updates the user's current stage in the study abroad journey.
    new_stage must be one of: ONBOARDING_INCOMPLETE, ONBOARDING_COMPLETE, DISCOVERY, SHORTLISTED, LOCKED, APPLICATION_PREP
    """
    return {"action": "update_stage", "value": new_stage}

def shortlist_university_tool(university_name: str, category: str):
    """
    Adds a university to the user's shortlist. 
    category must be: 'dream', 'target', or 'safe'.
    """
    return {"action": "shortlist", "university": university_name, "category": category}