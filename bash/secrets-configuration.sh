# In the GCP Console, with an existent .env file, run:

echo "Script started."

while IFS= read -r line; do
  # Debug: Show the current line being processed
  echo "Current line: $line"

  # Skip comments or empty lines
  if [[ "$line" =~ ^# ]] || [[ -z "$line" ]]; then
    echo "Skipping comment or empty line."
    continue
  fi

  # Use IFS to only split on the first '=' character
  IFS="=" read -r key value <<< "$line"

  # Debug: Show the key and value
  echo "Key: $key"
  echo "Value: $value"

  app="SGI_APP_BACKEND"
  full_key="${app}_${key}"

  # Create the secret in Google Cloud Secret Manager
  echo "Creating secret in Google Cloud Secret Manager."
  echo -n "$value" | gcloud secrets create "$full_key" --data-file=-
  
  if [ $? -eq 0 ]; then
    echo "Secret created successfully."
  else
    echo "Failed to create secret."
  fi

  # If the secret already exists and you wish to update it, uncomment the line below
  # echo -n "$value" | gcloud secrets versions add "$full_key" --data-file=-

done < .env

echo "Script completed."
