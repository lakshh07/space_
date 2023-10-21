const humanReadableAuthReason = "Verify";

const proofRequest = {
  circuitId: "credentialAtomicQuerySigV2",
  id: 1697868700,
  query: {
    allowedIssuers: ["*"],
    context: "ipfs://QmWYNAip9PY2Xq6GpyKfetB5mH54C16VkyV24HBJN85Z6v",
    credentialSubject: {
      test: {
        $eq: true,
      },
    },
    skipClaimRevocationCheck: true,
    type: "testing",
  },
};

module.exports = {
  humanReadableAuthReason,
  proofRequest,
};
